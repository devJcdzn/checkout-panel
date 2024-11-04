import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import Image from "next/image";

interface Props {
  onChange: (file: File | null) => void;
  placeholder?: string;
  disabled?: boolean;
  initialPreviewUrl?: File | string | null;
}

export function ImageUpload({
  onChange,
  placeholder,
  disabled,
  initialPreviewUrl,
}: Props) {
  const [previewUrl, setPreviewUrl] = useState<File | string | null>(
    initialPreviewUrl || null
  );

  useEffect(() => {
    // Atualiza a URL de pré-visualização se o `initialPreviewUrl` mudar
    setPreviewUrl(initialPreviewUrl || null);
  }, [initialPreviewUrl]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }

    onChange(file);
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    onChange(null);
  };

  return (
    <div className="flex flex-col items-center">
      {previewUrl ? (
        <div className="flex flex-col items-center space-y-1">
          <Image
            width={180}
            height={140}
            src={previewUrl as string}
            alt="Pré-visualização"
            className="object-cover rounded-md border"
          />
          <Button
            type="button"
            size="sm"
            onClick={handleRemoveImage}
            variant={"destructive"}
            className="w-full"
          >
            <X />
          </Button>
        </div>
      ) : (
        <label
          className="flex items-center justify-center w-1/2 mx-auto h-32 border-2 border-dashed rounded-md 
          cursor-pointer text-sm bg-muted-foreground/10 hover:bg-muted-foreground/20"
        >
          <span className="mx-auto truncate text-sm">
            {placeholder || "Selecione uma imagem"}
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            disabled={disabled}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
}
