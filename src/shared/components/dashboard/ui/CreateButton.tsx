type CreateButtonProp = {
    onClick: () => void
}

function CreateButton({ onClick }: CreateButtonProp) {
    return (
        <div className="relative">
            <button
                onClick={onClick}
                className="relative h-[50px] w-[150px] cursor-pointer overflow-hidden rounded-[30px] border border-[#e5c3e6] brightness-90 contrast-125 transition-all duration-300 ease-out hover:scale-[1.02] hover:brightness-95 active:scale-[0.98] active:brightness-85">
                <div className="absolute -top-2.5 -left-2.5 h-[50px] w-[150px] rounded-full bg-[#f05ee7] blur-md" />
                <div className="absolute -bottom-2.5 -left-2.5 h-[50px] w-[140px] rounded-full bg-[#f05ee7] blur-md" />
                <div className="absolute top-[-5px] -right-2.5 h-[50px] w-[120px] rounded-full bg-[#f05ee7] blur-md" />
                <div className="absolute -right-2.5 bottom-[-5px] h-[50px] w-[140px] rounded-full bg-[#f05ee7] blur-md" />
                <div className="absolute top-[25px] -left-5 h-[70px] w-[120px] rounded-full bg-[#f05ee7] opacity-70 blur-md" />
                <div className="absolute top-[25px] -right-5 h-[70px] w-[120px] rounded-full bg-[#f05ee7] opacity-70 blur-md" />
                <div className="absolute top-[-15px] left-[120px] h-[50px] w-[130px] rounded-full bg-[#f37130] blur-md" />
                <div className="absolute top-[30px] left-[90px] h-[50px] w-[170px] rounded-full bg-[#f37130] opacity-70 blur-md" />
                <div className="absolute top-20 left-[120px] h-[50px] w-[120px] rounded-full bg-[#f37130] blur-md" />
                <div className="absolute top-2 left-5 h-2.5 w-[130px] rounded-[25px] bg-white" />
                <div className="absolute top-[35px] left-10 h-[35px] w-[70px] rounded-[25px] bg-white" />
                <div className="absolute top-2 left-[200px] h-2.5 w-[70px] rounded-[25px] bg-white" />
                <div className="absolute top-[35px] left-[205px] h-[35px] w-[120px] rounded-[25px] bg-white" />
                <div className="absolute top-[30px] right-[9px] h-[65px] w-[30px] rounded-[25px] bg-white" />
                <div className="absolute bottom-[15px] left-10 h-2.5 w-[70px] rounded-[25px] bg-white" />
                <div className="absolute right-10 bottom-[15px] h-2.5 w-[70px] rounded-[25px] bg-white" />
                <div className="absolute top-[15px] right-5 h-[50px] w-[30px] rounded-[25px] bg-white" />
                <div className="absolute top-2.5 left-40 h-[30px] w-[30px] rounded-full bg-[#ff4600] blur-[3px]" />
                <div className="absolute top-[15px] left-[135px] h-5 w-5 rounded-full bg-[#ff4600] blur-[3px]" />
                <div className="absolute top-[15px] left-[115px] h-5 w-[15px] rounded-full bg-[#ff4600] blur-[3px]" />
                <div className="absolute bottom-[15px] left-[135px] h-[25px] w-5 rounded-full bg-[#ff4600] blur-[3px]" />
                <div className="absolute bottom-[15px] left-[195px] h-5 w-[15px] rounded-full bg-[#ff4600] blur-[3px]" />
                <div className="absolute bottom-0 left-[275px] h-[25px] w-[15px] rounded-full bg-[#ff4600] blur-[3px]" />
                <div className="absolute bottom-[55px] left-60 h-[50px] w-[35px] rounded-full bg-[#f37130] opacity-80 blur-md" />
                <div className="absolute top-0 left-[-5px] h-[30px] w-[30px] rounded-full bg-[#ba63d9]" />
                <div className="absolute -bottom-5 -left-5 h-[110px] w-[50px] rounded-full bg-[#ba63d9]" />
                <div className="absolute top-0 -right-5 h-[60px] w-[50px] rounded-full bg-[#ba63d9] opacity-70" />
                <div className="absolute -right-5 bottom-0 h-5 w-[50px] rounded-full bg-[#ba63d9] opacity-70" />
                <div className="absolute top-[25px] right-10 h-[30px] w-[70px] rounded-full bg-[#f05ee7] opacity-50 blur-md" />
                <div className="absolute top-[30px] left-0 h-[50px] w-[5px] rounded-[25px] bg-white opacity-60" />
                <div className="absolute top-[30px] right-0 h-[50px] w-[3px] rounded-[25px] bg-white opacity-90" />
                <div className="absolute inset-0 h-[110px] w-[335px] overflow-hidden rounded-[30px] bg-white/5 backdrop-blur-[6px]" />
                <div className="absolute top-[5px] left-[5px] h-[100px] w-[324px] rounded-[26px] bg-linear-to-b from-white/27 via-white/[0.067] to-white/40" />
                <div className="absolute top-[15px] left-5 h-[74px] w-[295px] rounded-[15px] border-[5px] border-white/40 blur-[2px]" />
                <div className="absolute top-[15px] left-5 h-[74px] w-[295px] rounded-[15px] border-2 border-white/27 blur-[1px]" />
                <div className="absolute top-1.5 left-[25px] h-[15px] w-[100px] border-b-[7px] border-l-[7px] border-white bg-transparent blur-xs" />
                <div className="absolute top-[15px] left-2 h-[25px] w-[15px] border-t-[3px] border-r-[3px] border-white/60 bg-transparent blur-[2px]" />
                <div className="absolute right-[9px] bottom-1.5 h-5 w-5 border-t-[7px] border-r-[7px] border-white bg-transparent blur-[3px]" />
                <div className="absolute right-[3px] bottom-7 h-5 w-5 border-b-[7px] border-l-[7px] border-white bg-transparent blur-[2px]" />
                <div className="absolute top-2.5 right-[13px] h-2.5 w-2.5 rounded-[25px] bg-white blur-[3px]" />
                <div className="absolute top-7 left-7 h-3 w-[15px] rounded-[25px] bg-white blur-[3px]" />
                <div className="absolute inset-0 z-10 flex items-center justify-center gap-2 font-sans text-[25px] font-semibold">
                    <svg
                        preserveAspectRatio="none"
                        viewBox="0 0 256 256"
                        height={20}
                        width={26}
                        xmlns="http://www.w3.org/2000/svg">
                        <g transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)">
                            <path
                                strokeLinecap="round"
                                fill="rgb(0,0,0)"
                                d="M 71.79 34.614 c -0.334 -0.497 -0.926 -0.745 -1.513 -0.63 l -18.311 3.528 l 3.718 -35.877 c 0.071 -0.682 -0.332 -1.32 -0.979 -1.55 c -0.648 -0.229 -1.362 0.011 -1.738 0.585 L 18.202 53.746 c -0.328 0.5 -0.325 1.144 0.008 1.639 c 0.33 0.493 0.922 0.742 1.513 0.632 l 18.312 -3.529 l -3.718 35.876 c -0.071 0.684 0.332 1.322 0.979 1.551 C 35.455 89.971 35.622 90 35.792 90 c 0.502 0 0.965 -0.251 1.241 -0.67 l 34.765 -53.076 C 72.126 35.754 72.122 35.11 71.79 34.614 z"
                            />
                        </g>
                    </svg>
                    <span className="text-sm">Create New</span>
                </div>
            </button>
        </div>
    )
}

export default CreateButton
