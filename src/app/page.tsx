"use client";

import { CreateUrlModal } from "@/shared/components/dashboard";
import { CreateButton } from "@/shared/components/ui";
import { useState } from "react";

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleCreate = async (fullUrl: string, shortUrl?: string) => {
    console.log("Creating short URL:", { fullUrl, shortUrl });
    const fetchRes = await fetch("/api/links", {
      method: "POST",
      body: JSON.stringify({ url: fullUrl, code: shortUrl }),
    });
    if (!fetchRes.ok) {
      console.log("FAILED TO CREATE NEW URL");
      return;
    }

    const fetchJson = await fetchRes.json();
    console.log(fetchJson);

    // return await database.addUrl(fullUrl, shortUrl);
  };
  const handleModalOpenClose = () => {
    setIsModalOpen((prev) => !prev);
  };
  return (
    <div className="m-3 relative min-h-fit bg-[#1e1e3f]/90 backdrop-blur-xl border border-purple-500/10 rounded ">
      <div className="flex justify-between flex-wrap">
        <div className="p-3">
          <CreateButton onClick={handleModalOpenClose} />
          <h1 className="pl-3 mt-5 text-amber-500">All Links</h1>
        </div>
        <div className="flex items-center p-3">
          <h1 className="">All Links</h1>
        </div>
      </div>
      <CreateUrlModal
        isOpen={isModalOpen}
        onClose={handleModalOpenClose}
        onCreate={handleCreate}
      />
    </div>
  );
}
