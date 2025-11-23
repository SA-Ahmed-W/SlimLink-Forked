"use client";

import { useState, FormEvent } from "react";

interface URLShortenerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (fullUrl: string, shortUrl?: string) => void | Promise<void>;
}

interface ShortenerFormElements extends HTMLFormControlsCollection {
  fullUrl: HTMLInputElement;
  shortUrl: HTMLInputElement;
}

interface ShortenerFormElement extends HTMLFormElement {
  readonly elements: ShortenerFormElements;
}

export default function CreateUrlModal({
  isOpen,
  onClose,
  onCreate,
}: URLShortenerModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent<ShortenerFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const form = e.currentTarget;
    const fullUrl = form.elements.fullUrl.value;
    const shortUrl = form.elements.shortUrl.value || undefined;

    try {
      await onCreate(fullUrl, shortUrl);
      form.reset();
      onClose();
    } catch (error) {
      console.error("Error creating short URL:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed h-fit inset-0 z-50 flex items-center justify-center backdrop-blur-md "
    >
      <form
        onSubmit={handleSubmit}
        className="text-neutral-800 py-6 relative overflow-hidden flex flex-col justify-around w-[450px] min-h-[280px] border border-purple-300 rounded-lg bg-neutral-50 p-6 shadow-xl"
      >
        {/* Decorative blur elements */}
        <div className="before:absolute before:w-32 before:h-20 before:right-2 before:bg-[#f05ee7] before:-z-10 before:rounded-full before:blur-xl before:-top-12 z-10 after:absolute after:w-24 after:h-24 after:bg-[#ba63d9] after:-z-10 after:rounded-full after:blur-lg after:-top-12 after:-right-6">
          <span className="font-extrabold text-2xl bg-linear-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
            Create Short URL
          </span>
          <p className="text-neutral-700 text-sm mt-1">
            Enter your long URL and optionally customize your short link
          </p>
        </div>

        {/* Input fields */}
        <div className="flex flex-col gap-4 mt-4">
          {/* Full URL Input */}
          <div className="relative rounded-lg overflow-hidden before:absolute before:w-12 before:h-12 before:content-[''] before:right-0 before:bg-purple-500 before:rounded-full before:blur-lg after:absolute after:z-10 after:w-20 after:h-20 after:content-[''] after:bg-[#f05ee7] after:right-12 after:top-3 after:rounded-full after:blur-lg">
            <input
              type="url"
              id="fullUrl"
              name="fullUrl"
              required
              className="relative bg-transparent ring-0 outline-none border border-neutral-500 text-neutral-900 placeholder-purple-700 text-sm rounded-lg focus:ring-purple-500 placeholder-opacity-60 focus:border-purple-500 block w-full p-2.5"
              placeholder="https://example.com/your-long-url"
            />
          </div>

          {/* Short URL Input (Optional) */}
          <div className="relative rounded-lg overflow-hidden before:absolute before:w-12 before:h-12 before:content-[''] before:right-0 before:bg-[#f37130] before:rounded-full before:blur-lg after:absolute after:z-10 after:w-20 after:h-20 after:content-[''] after:bg-[#ff4600] after:right-12 after:top-3 after:rounded-full after:blur-lg">
            <input
              type="text"
              id="shortUrl"
              name="shortUrl"
              className="relative bg-transparent ring-0 outline-none border border-neutral-500 text-neutral-900 placeholder-purple-700 text-sm rounded-lg focus:ring-purple-500 placeholder-opacity-60 focus:border-purple-500 block w-full p-2.5"
              placeholder="custom-short-url (optional)"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-linear-to-r from-purple-400 to-purple-600 text-white font-semibold py-2.5 px-4 rounded-lg hover:from-purple-500 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
          >
            {isLoading ? "Creating..." : "Create"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 border border-neutral-400 text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors duration-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
