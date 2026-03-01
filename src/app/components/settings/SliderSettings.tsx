import { useState } from 'react';
import { Image as ImageIcon, Upload, X, Trash2, Plus } from 'lucide-react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { toast } from "sonner";
import { convertToWebP, isValidImageFile } from "../../utils/imageUtils";

interface Slide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
}

interface SliderSettingsProps {
  sliderSettings: Slide[];
  setSliderSettings: React.Dispatch<React.SetStateAction<Slide[]>>;
}

export const SliderSettings = ({ sliderSettings, setSliderSettings }: SliderSettingsProps) => {
  const [uploadingSlideImage, setUploadingSlideImage] = useState<number | null>(null);

  const handleUploadSlideImage = async (
    event: React.ChangeEvent<HTMLInputElement>,
    slideId: number,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!isValidImageFile(file)) {
      toast.error("Invalid image file. Please upload a valid image.");
      return;
    }

    setUploadingSlideImage(slideId);
    try {
      const webPImage = await convertToWebP(file, {
        maxWidth: 1920,
        maxHeight: 1080,
        quality: 0.85,
      });
      setSliderSettings((prevSlides) =>
        prevSlides.map((slide) =>
          slide.id === slideId ? { ...slide, image: webPImage } : slide,
        ),
      );
      toast.success("Image uploaded and converted to WebP successfully!");
    } catch (error) {
      console.error("Error converting image to WebP:", error);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setUploadingSlideImage(null);
    }
  };

  const handleRemoveSlideImage = (slideId: number) => {
    setSliderSettings((prevSlides) =>
      prevSlides.map((slide) =>
        slide.id === slideId ? { ...slide, image: "" } : slide,
      ),
    );
    toast.success("Slide image removed");
  };

  const handleDeleteSlide = (slideId: number) => {
    if (sliderSettings.length <= 1) {
      toast.error("Cannot delete the last slide. At least one slide is required.");
      return;
    }

    if (confirm("Are you sure you want to delete this slide? This action cannot be undone.")) {
      setSliderSettings((prevSlides) => prevSlides.filter((slide) => slide.id !== slideId));
      toast.success("Slide deleted successfully");
      // Auto-save after deletion
      setTimeout(() => {
        const updatedSlides = sliderSettings.filter((slide) => slide.id !== slideId);
        localStorage.setItem("heroSlides", JSON.stringify(updatedSlides));
        window.dispatchEvent(new Event("sliderSettingsChanged"));
      }, 100);
    }
  };

  const handleAddSlide = () => {
    const newSlide: Slide = {
      id: Date.now(),
      image: "",
      title: "",
      subtitle: "",
    };
    setSliderSettings((prevSlides) => [...prevSlides, newSlide]);
    toast.success("New slide added");
  };

  const handleSaveSliderSettings = () => {
    toast.success("Slider settings saved successfully");
    localStorage.setItem("heroSlides", JSON.stringify(sliderSettings));
    window.dispatchEvent(new Event("sliderSettingsChanged"));
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-[#6B7F39]/20">
      <h2 className="text-xl font-semibold text-[#36454F] mb-6">
        Hero Slider Settings
      </h2>
      <div className="space-y-8 max-w-4xl">
        <p className="text-sm text-[#36454F]/70">
          Manage the hero slider images and text displayed on the homepage.
        </p>

        {sliderSettings.map((slide, index) => (
          <div
            key={slide.id}
            className="border border-[#6B7F39]/20 rounded-lg p-6 bg-gradient-to-br from-[#FAF4EC] to-white relative"
          >
            {/* Delete Button - Top Right */}
            {sliderSettings.length > 1 && (
              <button
                onClick={() => handleDeleteSlide(slide.id)}
                className="absolute top-4 right-4 p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all hover:scale-105 flex items-center gap-2 shadow-md"
                title="Delete this slide"
              >
                <Trash2 className="w-4 h-4" />
                <span className="text-sm">Delete</span>
              </button>
            )}

            <h3 className="font-semibold text-[#36454F] mb-4 flex items-center gap-2 pr-24">
              <ImageIcon className="w-5 h-5 text-[#6B7F39]" />
              Slide {index + 1}
              {sliderSettings.length === 1 && (
                <span className="text-xs text-[#7F8C8D] font-normal ml-2">(Required)</span>
              )}
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label>Slide Image</Label>
                <div className="mt-2">
                  {slide.image ? (
                    <div className="relative group">
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-48 object-cover rounded-lg border-2 border-[#6B7F39]/30"
                      />
                      {uploadingSlideImage === slide.id && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-lg">
                          <div className="text-center text-white">
                            <Upload className="w-8 h-8 mx-auto mb-2 animate-pulse" />
                            <p className="text-sm">Converting to WebP...</p>
                          </div>
                        </div>
                      )}
                      <button
                        onClick={() => handleRemoveSlideImage(slide.id)}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        title="Remove image only"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-full h-48 bg-[#F5E6D3] rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-[#6B7F39]/30">
                      <ImageIcon className="w-12 h-12 text-[#6B7F39]/50" />
                      <p className="text-sm text-[#6B7F39]/70 mt-2">No image uploaded</p>
                    </div>
                  )}
                  <div className="mt-3">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleUploadSlideImage(e, slide.id)}
                      disabled={uploadingSlideImage === slide.id}
                      className="hidden"
                      id={`slide-${slide.id}`}
                    />
                    <Label htmlFor={`slide-${slide.id}`} className="cursor-pointer">
                      <div className="bg-[#36454F] hover:bg-[#2C3E50] text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors">
                        <Upload className="w-4 h-4" />
                        <span className="text-sm">{slide.image ? 'Change Image' : 'Upload Image'}</span>
                      </div>
                    </Label>
                  </div>
                  <p className="text-xs text-[#36454F]/60 mt-2">
                    💡 Recommended: 1920x1080px (auto-converted to WebP)
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor={`title-${slide.id}`}>Title</Label>
                  <Input
                    id={`title-${slide.id}`}
                    value={slide.title}
                    onChange={(e) =>
                      setSliderSettings((prevSlides) =>
                        prevSlides.map((s) =>
                          s.id === slide.id ? { ...s, title: e.target.value } : s
                        )
                      )
                    }
                    placeholder="Enter slide title"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor={`subtitle-${slide.id}`}>Subtitle</Label>
                  <Textarea
                    id={`subtitle-${slide.id}`}
                    value={slide.subtitle}
                    onChange={(e) =>
                      setSliderSettings((prevSlides) =>
                        prevSlides.map((s) =>
                          s.id === slide.id ? { ...s, subtitle: e.target.value } : s
                        )
                      )
                    }
                    placeholder="Enter slide subtitle"
                    rows={3}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="mt-4">
          <Button
            onClick={handleAddSlide}
            className="bg-[#36454F] hover:bg-[#2C3E50] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Slide
          </Button>
        </div>

        <div className="mt-4">
          <Button
            onClick={handleSaveSliderSettings}
            className="bg-[#36454F] hover:bg-[#2C3E50] text-white"
          >
            Save Slider Settings
          </Button>
        </div>
      </div>
    </div>
  );
};