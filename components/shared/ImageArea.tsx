"use client";

import { useState, useEffect } from "react";
import * as React from "react";
import Image from "next/image";
import { ImagePlus } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { ImageModal } from "./ImageModal";

export function ImageCarousel({
  items,
  isLoading,
}: {
  items: ImageProps[];
  isLoading: boolean;
}) {
  const [selectedImage, setSelectedImage] = useState<ImageProps | null>(null);
  const [api, setApi] = useState<any>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className="container h-auto w-full shrink-0 rounded-lg border border-solid border-[#C2C2C2] bg-white p-5 lg:p-10">
      <div className="flex items-start gap-4 pb-3 lg:pb-3.5">
        <ImagePlus size={24} />
        <h3 className="text-base font-bold uppercase leading-[152.5%] text-black">
          Images:{" "}
        </h3>
      </div>
      <div className="flex w-full max-w-[890px] flex-wrap justify-center content-center items-center gap-[15px]">
        {isLoading ? (
          <>
            <div className="h-20 w-[260px] max-w-sm animate-pulse rounded-md bg-gray-300" />
            <div className="h-20 w-[260px] max-w-sm animate-pulse rounded-md bg-gray-300" />
            <div className="h-20 w-[260px] max-w-sm animate-pulse rounded-md bg-gray-300" />
            <div className="h-20 w-[260px] max-w-sm animate-pulse rounded-md bg-gray-300" />
            <div className="h-20 w-[260px] max-w-sm animate-pulse rounded-md bg-gray-300" />
            <div className="h-20 w-[260px] max-w-sm animate-pulse rounded-md bg-gray-300" />
          </>
        ) : items.length > 0 ? (
          <>
            <Carousel
              setApi={setApi}
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full relative"
            >
              <CarouselContent className="-ml-2 sm:-ml-4">
                {items.map((image, index) => (
                  <CarouselItem
                    key={index}
                    className="pl-2 sm:pl-4 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                  >
                    <div className="p-1">
                      <Card className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="relative aspect-square">
                            <Image
                              src={image.url}
                              alt=""
                              fill
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              className="object-cover transition-transform duration-300 ease-in-out hover:scale-105 cursor-pointer"
                              onClick={() => setSelectedImage(image)}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
              <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
            </Carousel>
            <ImageModal
              image={selectedImage}
              onClose={() => setSelectedImage(null)}
            />
          </>
        ) : (
          <div>Could not fetch images.</div>
        )}
      </div>
    </div>
  );
}
