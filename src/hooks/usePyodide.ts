"use client";

import { useState, useEffect, useCallback } from "react";

declare global {
  interface Window {
    loadPyodide: any;
  }
}

export function usePyodide() {
  const [pyodide, setPyodide] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (pyodide || loading) return;

    const load = async () => {
      setLoading(true);
      try {
        if (!window.loadPyodide) {
          const script = document.createElement("script");
          script.src = "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js";
          script.async = true;
          document.head.appendChild(script);

          await new Promise((resolve) => {
            script.onload = resolve;
          });
        }

        const py = await window.loadPyodide({
          indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/",
        });
        
        setPyodide(py);
      } catch (err: any) {
        console.error("Failed to load Pyodide:", err);
        setError("Failed to load Python runtime.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [pyodide, loading]);

  const runCode = useCallback(async (code: string) => {
    if (!pyodide) return "Python runtime not ready...";
    
    try {
      // 1. Setup Base Environment & Clear Buffers
      await pyodide.runPythonAsync(`
import sys
import io
import os
import shutil
import zipfile

# Ensure stdout/stderr are captured and reset
if not hasattr(sys, "stdout") or not isinstance(sys.stdout, io.StringIO):
    sys.stdout = io.StringIO()
if not hasattr(sys, "stderr") or not isinstance(sys.stderr, io.StringIO):
    sys.stderr = io.StringIO()

sys.stdout.seek(0)
sys.stdout.truncate(0)
sys.stderr.seek(0)
sys.stderr.truncate(0)

if "download_nltk_data" not in globals():
    async def download_nltk_data(resource_id):
        from pyodide.http import pyfetch
        import nltk
        
        base_url = "https://raw.githubusercontent.com/nltk/nltk_data/gh-pages/packages/"
        mappings = {
            "vader_lexicon": "sentiment/vader_lexicon.zip",
            "stopwords": "corpora/stopwords.zip",
            "punkt": "tokenizers/punkt.zip",
            "wordnet": "corpora/wordnet.zip",
            "omw-1.4": "corpora/omw-1.4.zip",
            "averaged_perceptron_tagger": "taggers/averaged_perceptron_tagger.zip",
            "maxent_ne_chunker": "chunkers/maxent_ne_chunker.zip",
            "words": "corpora/words.zip",
        }
        
        if resource_id not in mappings:
            return False

        data_path = "/home/pyodide/nltk_data"
        if data_path not in nltk.data.path:
            nltk.data.path.insert(0, data_path)
        
        mapping_file = mappings[resource_id]
        category = os.path.dirname(mapping_file)
        target_category_path = os.path.join(data_path, category)
        resource_dir = os.path.join(target_category_path, resource_id)
        
        # Check if already installed
        if resource_id == "vader_lexicon":
            if os.path.exists(os.path.join(resource_dir, "vader_lexicon.txt")):
                return True
        elif os.path.exists(resource_dir) and os.listdir(resource_dir):
            return True

        print(f"Downloading NLTK data: {resource_id}...")
        try:
            response = await pyfetch(base_url + mapping_file)
            if response.status != 200: 
                print(f"Error: Failed to download {resource_id}")
                return False
            data = await response.bytes()
            os.makedirs(target_category_path, exist_ok=True)
            z = zipfile.ZipFile(io.BytesIO(data))
            z.extractall(target_category_path)
            
            if resource_id == "punkt":
                py3_path = os.path.join(resource_dir, "PY3")
                os.makedirs(py3_path, exist_ok=True)
                for f in os.listdir(resource_dir):
                    if f.endswith(".pickle"):
                        shutil.copy(os.path.join(resource_dir, f), os.path.join(py3_path, f))
            
            if resource_id == "vader_lexicon":
                inner_vader = os.path.join(resource_dir, "vader_lexicon")
                if os.path.isdir(inner_vader):
                    for f in os.listdir(inner_vader):
                        shutil.copy(os.path.join(inner_vader, f), os.path.join(resource_dir, f))
                
                zip_dir = os.path.join(target_category_path, "vader_lexicon.zip")
                os.makedirs(os.path.join(zip_dir, "vader_lexicon"), exist_ok=True)
                for f in os.listdir(resource_dir):
                    if os.path.isfile(os.path.join(resource_dir, f)):
                        shutil.copy(os.path.join(resource_dir, f), os.path.join(zip_dir, "vader_lexicon", f))
            
            print(f"Successfully installed {resource_id}")
            return True
        except Exception as e:
            print(f"Error installing {resource_id}: {str(e)}")
            return False

def setup_mocks():
    import sys
    from types import ModuleType

    # Helper to create a mock module
    def mock_module(name, attributes):
        m = ModuleType(name)
        for k, v in attributes.items():
            setattr(m, k, v)
        sys.modules[name] = m
        return m

    # 1. Mock Flask
    if "flask" not in sys.modules:
        def jsonify(data): return data
        
        class MockRequest:
            @property
            def remote_addr(self): return "127.0.0.1"
            def get_json(self): return {"text": "This is a mock request body for testing the API logic."}
        
        def route(path, methods=None):
            def decorator(f):
                print(f"✅ Mock Flask: Registered route {path} [{', '.join(methods or ['GET'])}]")
                return f
            return decorator

        class Flask:
            def __init__(self, name): 
                self.name = name
                self.config = {}
            def route(self, path, methods=None): return route(path, methods)
            def run(self, **kwargs):
                print(f"🚀 Mock Flask Server: Running on http://localhost:{kwargs.get('port', 5000)} (Simulated)")
                print("Note: This is a browser-side simulation. Real network requests are not possible.")

        mock_module("flask", {
            "Flask": Flask,
            "request": MockRequest(),
            "jsonify": jsonify
        })

    # 2. Mock Flask-CORS
    if "flask_cors" not in sys.modules:
        mock_module("flask_cors", {"CORS": lambda app, **kwargs: print("✅ Mock CORS enabled")})

    # 3. Mock Gunicorn
    # (Usually run via CLI, but let's mock the module if imported)
    if "gunicorn" not in sys.modules:
        mock_module("gunicorn", {"version_info": (20, 1, 0)})

setup_mocks()
      `);
      
      // 2. Load Packages
      await pyodide.loadPackagesFromImports(code);

      // 2.1 Explicit Package Fallback with Micropip
      const PKG_MAP: Record<string, string> = {
        'import seaborn': 'seaborn',
        'import matplotlib': 'matplotlib',
        'import sklearn': 'scikit-learn',
        'from sklearn': 'scikit-learn',
        'import pandas': 'pandas',
        'import numpy': 'numpy',
      };

      let micropipLoaded = false;
      for (const [key, pkg] of Object.entries(PKG_MAP)) {
        if (code.includes(key)) {
          if (!micropipLoaded) {
            await pyodide.loadPackage("micropip");
            micropipLoaded = true;
          }
          try {
            const micropip = pyodide.pyimport("micropip");
            await micropip.install(pkg);
          } catch (e) {
            console.warn(`Micropip failed to install ${pkg}, falling back to loadPackage`);
            await pyodide.loadPackage(pkg);
          }
        }
      }

      // 3. Implicit & Explicit NLTK Data Detection
      const NLTK_DEPS: Record<string, string> = {
        'word_tokenize': 'punkt',
        'sent_tokenize': 'punkt',
        'stopwords': 'stopwords',
        'WordNetLemmatizer': 'wordnet',
        'SentimentIntensityAnalyzer': 'vader_lexicon',
        'vader': 'vader_lexicon',
        'pos_tag': 'averaged_perceptron_tagger',
        'ne_chunk': 'maxent_ne_chunker',
        'words': 'words',
      };

      const resourcesToInstall = new Set<string>();
      const explicitRegex = /nltk\.download\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
      let match;
      while ((match = explicitRegex.exec(code)) !== null) resourcesToInstall.add(match[1]);
      for (const [key, res] of Object.entries(NLTK_DEPS)) {
        if (code.includes(key)) {
          resourcesToInstall.add(res);
          if (key === 'ne_chunk') {
            // ne_chunk requires numpy to unpickle its models 
            await pyodide.loadPackage("numpy");
          }
        }
      }

      if (resourcesToInstall.size > 0 || code.includes("import nltk") || code.includes("from nltk")) {
        await pyodide.runPythonAsync(`
import sys
if "nltk" not in sys.modules:
    import pyodide_js
    await pyodide_js.loadPackage("nltk")
import nltk.data
if "/home/pyodide/nltk_data" not in nltk.data.path:
    nltk.data.path.insert(0, "/home/pyodide/nltk_data")

# Redirection Patch: Handle NLTK's hardcoded path quirks in browser
if not hasattr(nltk.data, "_original_load"):
    nltk.data._original_load = nltk.data.load
    def redirected_load(resource_url, format='auto', cache=True, verbose=False, logic_errors=False):
        import os
        if "vader_lexicon" in resource_url:
            v_path = "/home/pyodide/nltk_data/sentiment/vader_lexicon/vader_lexicon.txt"
            if os.path.exists(v_path):
                return nltk.data._original_load(v_path, format, cache, verbose, logic_errors)
        if "punkt" in resource_url and resource_url.endswith(".pickle"):
            lang = os.path.basename(resource_url)
            p_path = f"/home/pyodide/nltk_data/tokenizers/punkt/PY3/{lang}"
            if os.path.exists(p_path):
                return nltk.data._original_load(p_path, format, cache, verbose, logic_errors)
        if "averaged_perceptron_tagger" in resource_url:
            t_path = "/home/pyodide/nltk_data/taggers/averaged_perceptron_tagger/averaged_perceptron_tagger.pickle"
            if os.path.exists(t_path):
                return nltk.data._original_load(t_path, format, cache, verbose, logic_errors)
        if "maxent_ne_chunker" in resource_url:
            c_path = "/home/pyodide/nltk_data/chunkers/maxent_ne_chunker/english_ace.pickle"
            if os.path.exists(c_path):
                return nltk.data._original_load(c_path, format, cache, verbose, logic_errors)
        return nltk.data._original_load(resource_url, format, cache, verbose, logic_errors)
    nltk.data.load = redirected_load

if not hasattr(nltk, "_original_download"):
    nltk._original_download = nltk.download
nltk.download = lambda *args, **kwargs: True
        `);

        if (resourcesToInstall.size > 0) {
          const resIds = Array.from(resourcesToInstall);
          for (const resId of resIds) {
            try {
              await pyodide.runPythonAsync(`await download_nltk_data("${resId}")`);
            } catch (e) {
              console.error(`Failed to install ${resId}:`, e);
            }
          }
        }
      }

      // Execute User Code
      let runException: any = null;
      try {
        await pyodide.runPythonAsync(code);
      } catch (e: any) {
        runException = e;
      }
      
      let stdout = await pyodide.runPythonAsync("sys.stdout.getvalue()");
      let stderr = await pyodide.runPythonAsync("sys.stderr.getvalue()");
      
      const hasLookupError = (stderr && stderr.includes("LookupError")) || (runException && runException.message.includes("LookupError"));
      if (hasLookupError) {
          await pyodide.runPythonAsync(`
import os
import nltk
print("\\n--- NLTK Diagnostics ---")
print(f"NLTK Path: {nltk.data.path}")
base = "/home/pyodide/nltk_data"
if os.path.exists(base):
    for root, dirs, files in os.walk(base):
        level = root.replace(base, '').count(os.sep)
        indent = ' ' * 4 * (level)
        print(f"{indent}{os.path.basename(root)}/")
        subindent = ' ' * 4 * (level + 1)
        for f in files:
            print(f"{subindent}{f}")
else:
    print("NLTK data directory does not exist!")
          `);
          stdout = await pyodide.runPythonAsync("sys.stdout.getvalue()");
      }
      
      const result = stdout + (stderr ? "\nError: " + stderr : "") + (runException ? "\nException: " + runException.message : "");
      return result || ">>> [No Output]";
    } catch (err: any) {
      return `Initialization Error: ${err.message}`;
    }
  }, [pyodide]);

  return { pyodide, loading, error, runCode };
}
