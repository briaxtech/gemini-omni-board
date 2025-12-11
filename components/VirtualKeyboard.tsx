import React from 'react';

interface VirtualKeyboardProps {
    onKeyPress: (key: string) => void;
    onClose?: () => void;
}

const KEYS = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '-']
];

const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({ onKeyPress, onClose }) => {
    const handleTouch = (e: React.TouchEvent | React.MouseEvent, key: string) => {
        e.preventDefault(); // Prevent focus loss
        onKeyPress(key);
    };

    return (
        <div className="flex flex-col gap-2 p-4 bg-slate-100/90 backdrop-blur-md rounded-2xl border border-slate-200 shadow-xl select-none touch-none">
            {KEYS.map((row, rowIndex) => (
                <div key={rowIndex} className="flex gap-2 justify-center">
                    {row.map((key) => (
                        <button
                            key={key}
                            onMouseDown={(e) => handleTouch(e, key)}
                            onTouchStart={(e) => handleTouch(e, key)}
                            className="w-8 h-10 md:w-10 md:h-12 flex items-center justify-center bg-white rounded-lg shadow-sm font-semibold text-slate-700 active:bg-indigo-100 active:scale-95 transition-all text-sm md:text-base border-b-2 border-slate-200 active:border-b-0 translate-y-0 active:translate-y-[2px]"
                        >
                            {key}
                        </button>
                    ))}
                </div>
            ))}
            <div className="flex gap-2 justify-center mt-1">
                <button
                    onMouseDown={(e) => handleTouch(e, ' ')}
                    onTouchStart={(e) => handleTouch(e, ' ')}
                    className="w-48 h-10 md:h-12 flex items-center justify-center bg-white rounded-lg shadow-sm font-medium text-slate-600 active:bg-indigo-100 active:scale-95 transition-all border-b-2 border-slate-200 active:border-b-0 translate-y-0 active:translate-y-[2px]"
                >
                    Espacio
                </button>
                <button
                    onMouseDown={(e) => handleTouch(e, 'Backspace')}
                    onTouchStart={(e) => handleTouch(e, 'Backspace')}
                    className="w-16 h-10 md:h-12 flex items-center justify-center bg-rose-100 text-rose-600 rounded-lg shadow-sm font-medium active:bg-rose-200 active:scale-95 transition-all border-b-2 border-rose-200 active:border-b-0 translate-y-0 active:translate-y-[2px]"
                >
                    ⌫
                </button>
                {onClose && (
                    <button
                        onMouseDown={onClose}
                        onTouchStart={onClose}
                        className="w-16 h-10 md:h-12 flex items-center justify-center bg-slate-200 text-slate-600 rounded-lg shadow-sm font-medium active:bg-slate-300 active:scale-95 transition-all border-b-2 border-slate-300 active:border-b-0 translate-y-0 active:translate-y-[2px]"
                    >
                        ⌨️
                    </button>
                )}
            </div>
        </div>
    );
};

export default VirtualKeyboard;
