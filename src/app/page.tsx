"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Upload, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";

export default function Home() {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [custom, setCustom] = useState("");
  const [reply, setReply] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

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
      toast({ title: "Ops", description: "Manda print ou texto da conversa", variant: "destructive" });
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
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (txt: string) => {
    navigator.clipboard.writeText(txt);
    toast({ title: "Copiado!", description: "Tá na área de transferência" });
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white p-4">
      <h1 className="text-4xl font-bold text-center mb-2">Rizz Gemini 🔥</h1>
      <p className="text-center text-slate-400 mb-6">Wingman IA pra mato grossense</p>

      <Card className="bg-slate-900/60 border-slate-700 mb-6">
        <CardHeader><CardTitle>Manda o print ou texto</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Print da conversa</Label>
            <div className="border-2 border-dashed border-slate-600 rounded-lg p-4 text-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              {imagePreview ? <Image src={imagePreview} alt="preview" width={300} height={200} className="mx-auto" /> : <Upload className="mx-auto h-10 w-10 text-slate-400" />}
              <Input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageChange} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Ou cola o texto</Label>
            <Textarea value={text} onChange={e => setText(e.target.value)} placeholder="Ex: Ela: Oi gato\nEu: E aí princesa?" rows={4} className="bg-slate-800" />
          </div>

          <div className="space-y-2">
            <Label>Instrução extra (opcional)</Label>
            <Input value={custom} onChange={e => setCustom(e.target.value)} placeholder="Ex: Usa gíria cearense" className="bg-slate-800" />
          </div>

          <Button onClick={handleSubmit} disabled={loading} className="w-full bg-pink-600 hover:bg-pink-700">
            {loading ? <Loader2 className="animate-spin mr-2" /> : null}
            Gerar Rizz
          </Button>
        </CardContent>
      </Card>

      {reply && (
        <Card className="bg-slate-900/60 border-slate-700">
          <CardHeader><CardTitle>Respostas geradas</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reply.split('\n\n').filter(Boolean).map((block, i) => (
                <div key={i} className="bg-slate-800 p-4 rounded relative">
                  <pre className="whitespace-pre-wrap text-sm">{block.trim()}</pre>
                  <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => copyToClipboard(block.trim())}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <p className="text-center text-slate-500 mt-8 text-sm">Feito em Fortaleza • Powered by Gemini</p>
    </main>
  );
      }
