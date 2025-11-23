export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        {/* Loading Spinner */}
        <div className="loadingspinner relative mx-auto h-[calc(2*30px+26px)] w-[calc(3*30px+26px)]">
          <div className="square1 absolute inline-block h-[26px] w-[26px] rounded-xs bg-[darkorange] animate-[square1_2.4s_0.2s_ease-in-out_infinite,squarefadein_0.4s_0.1s_ease-out_both]"></div>
          <div className="square2 absolute inline-block h-[26px] w-[26px] rounded-xs bg-[darkorange] animate-[square2_2.4s_0.2s_ease-in-out_infinite,squarefadein_0.4s_0.1s_ease-out_both]"></div>
          <div className="square3 absolute inline-block h-[26px] w-[26px] rounded-xs bg-[darkorange] animate-[square3_2.4s_0.2s_ease-in-out_infinite,squarefadein_0.4s_0.2s_ease-out_both]"></div>
          <div className="square4 absolute inline-block h-[26px] w-[26px] rounded-xs bg-[darkorange] animate-[square4_2.4s_0.2s_ease-in-out_infinite,squarefadein_0.4s_0.3s_ease-out_both]"></div>
          <div className="square5 absolute inline-block h-[26px] w-[26px] rounded-xs bg-[darkorange] animate-[square5_2.4s_0.2s_ease-in-out_infinite,squarefadein_0.4s_0.4s_ease-out_both]"></div>
        </div>

        {/* Text Content */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Redirecting...
          </h2>
          <p className="text-sm text-gray-600">
            Please wait while we send you to your destination.
          </p>
        </div>
      </div>
    </div>
  );
}
