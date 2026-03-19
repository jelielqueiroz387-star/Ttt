"use client";

import { useState, useRef } from "react";
import Image from "next/image";

export default function Home() {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [custom, setCustom] = useState("");
  const [reply, setReply] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!image && !text.trim()) {
      alert("Manda print ou texto da conversa!");
      return;
    }

    setLoading(true);
    setReply("");

    const formData = new FormData();
    if (image) formData.append("image", image);
    formData.append("text", text);
    formData.append("custom", custom);

    try {
      const res = await fetch("/api/rizz", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Deu pau");

      setReply(data.reply);
    } catch (err: any) {
      alert("Erro: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (txt: string) => {
    navigator.clipboard.writeText(txt);
    alert("Copiado!");
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white p-6">
      <h1 className="text-4xl font-bold text-center mb-4">Rizz Gemini 🔥</h1>
      <p className="text-center text-slate-400 mb-8">Wingman IA - Manda print ou texto</p>

      <div className="max-w-2xl mx-auto bg-slate-900/60 border border-slate-700 rounded-xl p-6 space-y-6">
        {/* Upload */}
        <div>
          <label className="block mb-2 text-sm">Print da conversa</label>
          <div 
            className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center cursor-pointer hover:border-slate-400"
            onClick={() => fileInputRef.current?.click()}
          >
            {imagePreview ? (
              <Image src={imagePreview} alt="preview" width={400} height={300} className="mx-auto rounded" />
            ) : (
              <div>
                <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p>Clique ou arraste o print</p>
              </div>
            )}
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleImageChange} 
            />
          </div>
        </div>

        {/* Texto */}
        <div>
          <label className="block mb-2 text-sm">Ou cole o texto</label>
          <textarea 
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Ex: Ela: Oi tudo bem?\nEu: Tô de boa e tu?"
            className="w-full h-32 p-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Custom */}
        <div>
          <label className="block mb-2 text-sm">Instrução extra (opcional)</label>
          <input 
            value={custom}
            onChange={e => setCustom(e.target.value)}
            placeholder="Ex: Seja mais direto ou usa gíria cearense"
            className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
          />
        </div>

        <button 
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg font-bold hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Gerando..." : "Gerar Rizz 🔥"}
        </button>
      </div>

      {reply && (
        <div className="max-w-2xl mx-auto mt-8 bg-slate-900/60 border border-slate-700 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">Respostas geradas</h2>
          <div className="space-y-4">
            {reply.split('\n\n').filter(Boolean).map((block, i) => (
              <div key={i} className="bg-slate-800 p-4 rounded-lg relative">
                <pre className="whitespace-pre-wrap text-sm font-sans">{block.trim()}</pre>
                <button 
                  onClick={() => copyToClipboard(block.trim())}
                  className="absolute top-2 right-2 text-slate-400 hover:text-white"
                >
                  Copiar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-center text-slate-500 mt-12 text-sm">Powered by Gemini • Feito em Fortaleza</p>
    </main>
  );
  }
