'use client';

import React from 'react';
import { Eye, Image as ImageIcon, Video, FileText } from 'lucide-react';

export default function ProjectGalleryPage() {
  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Create a project gallery</h1>
          <button className="flex items-center justify-center gap-2 text-[#00E676] border border-[#00E676]/30 px-5 py-2 rounded-full hover:bg-[#00E676]/10 transition-all text-sm font-medium w-fit">
            <Eye className="w-4 h-4" /> Preview project
          </button>
        </div>

        {/* Project Images Section */}
        <div className="mb-12">
          <h2 className="text-xl md:text-2xl font-semibold mb-2">Project Images</h2>
          <p className="text-gray-300 text-sm md:text-base mb-6">
            Upload up to 20 images (.jpg or .png), up to 10MB each and less than 4,000 pixels, in width or height.
          </p>
          
          <div className="w-full sm:w-[320px] h-[260px] bg-[#111111] rounded-2xl flex flex-col items-center justify-center border border-white/5 hover:border-white/20 transition-all cursor-pointer group">
            <ImageIcon className="w-10 h-10 text-gray-400 mb-4 group-hover:text-gray-200 transition-colors" strokeWidth={1.5} />
            <p className="text-gray-200 text-sm">
              Drag image here or
            </p>
            <span className="text-[#00E676] text-sm mt-1">browse</span>
          </div>
        </div>

        {/* Project Video Section */}
        <div className="mb-12">
          <h2 className="text-xl md:text-2xl font-semibold mb-2">Project video</h2>
          <p className="text-gray-300 text-sm md:text-base mb-6">
            Upload one video (.mp4), up to 100MB and less than 90 seconds. We recommend a video less than 60 seconds.
          </p>
          
          <div className="w-full sm:w-[320px] h-[260px] bg-[#111111] rounded-2xl flex flex-col items-center justify-center border border-white/5 hover:border-white/20 transition-all cursor-pointer group">
            <Video className="w-10 h-10 text-gray-400 mb-4 group-hover:text-gray-200 transition-colors" strokeWidth={1.5} />
            <p className="text-gray-200 text-sm">
              Drag video here or
            </p>
            <span className="text-[#00E676] text-sm mt-1">browse</span>
          </div>
        </div>

        {/* Sample Documents Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-xl md:text-2xl font-semibold">Sample Documents (optional)</h2>
            <span className="bg-[#42A5F5] text-black text-[11px] font-bold px-2.5 py-0.5 rounded-full">New</span>
          </div>
          <p className="text-gray-300 text-sm md:text-base mb-6">
            Add up to 2 PDF files that are less than 2 MB each. Clients will only see the first 3 pages of your file.
          </p>
          
          <div className="w-full sm:w-[320px] h-[260px] bg-[#111111] rounded-2xl flex flex-col items-center justify-center border border-white/5 hover:border-white/20 transition-all cursor-pointer group">
            <div className="relative mb-4">
              <FileText className="w-10 h-10 text-gray-400 group-hover:text-gray-200 transition-colors" strokeWidth={1.5} />
              <div className="absolute inset-0 flex items-center justify-center mt-2">
                 <span className="text-[8px] font-bold text-gray-400 group-hover:text-gray-200">PDF</span>
              </div>
            </div>
            <p className="text-gray-200 text-sm">
              Drag document here or
            </p>
            <span className="text-[#00E676] text-sm mt-1">browse</span>
          </div>
        </div>

      </div>
    </div>
  );
}
