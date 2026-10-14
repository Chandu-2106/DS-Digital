"""Local Python + Java sandbox backend. Run: python backend.py"""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import base64, contextlib, io, json, os, shutil, subprocess, sys, tempfile
ROOT=Path(__file__).resolve().parent; HOST='127.0.0.1'; PORT=8000; TIMEOUT=15; MAX_CODE=100_000
class Handler(SimpleHTTPRequestHandler):
 def end_headers(self):
  self.send_header('Access-Control-Allow-Origin','*'); self.send_header('Access-Control-Allow-Headers','Content-Type'); self.send_header('Access-Control-Allow-Methods','GET,POST,OPTIONS'); super().end_headers()
 def do_OPTIONS(self): self.send_response(204); self.end_headers()
 def do_POST(self):
  if self.path!='/run': return self.send_json(404,{'error':'Endpoint not found'})
  try:
   length=int(self.headers.get('Content-Length','0'))
   if length>MAX_CODE+10000:return self.send_json(413,{'error':'Code is too large'})
   data=json.loads(self.rfile.read(length).decode('utf-8')); code=data.get('code',''); lang=data.get('language','python').lower()
   if not isinstance(code,str) or not code.strip():return self.send_json(400,{'error':'No code supplied'})
   if len(code)>MAX_CODE:return self.send_json(413,{'error':'Code is too large'})
   if lang not in ('python','java'):return self.send_json(400,{'error':'Choose Python or Java'})
   with tempfile.TemporaryDirectory(prefix='mbu_sandbox_') as td:
    td=Path(td); env=os.environ.copy(); env['PYTHONIOENCODING']='utf-8'; env['MPLBACKEND']='Agg'
    if lang=='python':
     script=td/'main.py'
     # Capture matplotlib/seaborn plots for display in the browser, while keeping ordinary print output.
     prelude='''import os, io, base64, atexit\n_figures=[]\ntry:\n import matplotlib\n matplotlib.use("Agg")\n import matplotlib.pyplot as _plt\n _original_show=_plt.show\n def _capture_show(*a, **k):\n  for _n in _plt.get_fignums():\n   _b=io.BytesIO(); _plt.figure(_n).savefig(_b,format="png",bbox_inches="tight"); _figures.append(base64.b64encode(_b.getvalue()).decode("ascii"))\n  _plt.close("all")\n _plt.show=_capture_show\n atexit.register(_capture_show)\nexcept ImportError:\n pass\n'''
     script.write_text(prelude+'\n'+code+'\n',encoding='utf-8')
     # retrieve figure payload through a small wrapper that writes to a temp file
     wrapper=td/'runner.py'; payload=td/'figures.json'
     wrapper.write_text(prelude+'\n'+code+'\nwith open('+repr(str(payload))+',"w",encoding="utf-8") as _f: json.dump(_figures,_f)\n',encoding='utf-8')
     # wrapper needs json available
     wrapper.write_text('import json\n'+wrapper.read_text(),encoding='utf-8')
     proc=subprocess.run([sys.executable,'-u',str(wrapper)],cwd=td,capture_output=True,text=True,timeout=TIMEOUT,env=env)
     figures=json.loads(payload.read_text()) if payload.exists() else []
    else:
     if not shutil.which('javac') or not shutil.which('java'): return self.send_json(503,{'error':'Java is not installed or javac/java are not on PATH. Install a JDK 17+ and restart the terminal.'})
     # Accept public class Main or a simple class name; write as Main.java for predictable sandbox use.
     source=code
     match=__import__('re').search(r'public\s+class\s+([A-Za-z_$][\w$]*)',source)
     class_name=match.group(1) if match else 'Main'
     if class_name!='Main':
      source=__import__('re').sub(r'public\s+class\s+'+__import__('re').escape(class_name)+r'\b','public class Main',source, count=1)
     java=td/'Main.java'; java.write_text(source,encoding='utf-8')
     comp=subprocess.run(['javac',str(java)],cwd=td,capture_output=True,text=True,timeout=TIMEOUT,env=env)
     if comp.returncode: return self.send_json(200,{'stdout':'','stderr':comp.stderr,'returncode':comp.returncode,'figures':[]})
     proc=subprocess.run(['java','-cp',str(td),'Main'],cwd=td,capture_output=True,text=True,timeout=TIMEOUT,env=env); figures=[]
   self.send_json(200,{'stdout':proc.stdout,'stderr':proc.stderr,'returncode':proc.returncode,'figures':figures})
  except subprocess.TimeoutExpired:self.send_json(408,{'error':f'Execution timed out after {TIMEOUT} seconds'})
  except json.JSONDecodeError:self.send_json(400,{'error':'Invalid JSON request'})
  except Exception as exc:self.send_json(500,{'error':str(exc)})
 def send_json(self,status,payload):
  body=json.dumps(payload).encode('utf-8'); self.send_response(status); self.send_header('Content-Type','application/json; charset=utf-8'); self.send_header('Content-Length',str(len(body))); self.end_headers(); self.wfile.write(body)
if __name__=='__main__':
 os.chdir(ROOT); print(f'MBU portal and sandbox running at http://{HOST}:{PORT}'); print('Keep this terminal open while using the sandbox.'); ThreadingHTTPServer((HOST,PORT),Handler).serve_forever()
