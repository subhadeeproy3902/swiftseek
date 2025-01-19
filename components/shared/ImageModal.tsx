"use client";

import * as React from "react";
import Image from "next/image";
import { X, Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import * as htmlToImage from "html-to-image";

interface ImageModalProps {
  image: {
    url: string;
    description: string;
  } | null;
  onClose: () => void;
}

export function ImageModal({ image, onClose }: ImageModalProps) {
  const handleDownload = () => {
    // Actually download the image using a module named html-to-image
    const node = document.getElementById("swiftseek-image");
    if (node) {
      htmlToImage.toPng(node).then(function (dataUrl) {
        var link = document.createElement("a");
        link.download = "swiftseek-image.png";
        link.href = dataUrl;
        link.click();
      });
    }
  };

  if (!image) return null;

  return (
    <Dialog open={!!image} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl h-[90vh] p-0 overflow-hidden">
        <div className="relative h-full flex flex-col">
          <DialogHeader className="p-6 bg-background/80 backdrop-blur-sm z-10">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-xl font-semibold">
                  SwiftSeek Image
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground mt-1">
                  {image.description}
                </DialogDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="shrink-0"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </DialogHeader>
          <div className="flex-grow overflow-auto">
            <div className="relative w-full h-full">
              <Image
                src={image.url}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                className="object-contain"
                id="swiftseek-image"
              />
            </div>
          </div>
          <div className="p-6 bg-background/80 backdrop-blur-sm">
            <Button onClick={handleDownload} className="w-full sm:w-auto">
              <Download className="h-4 w-4 mr-2" />
              Download Image
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
