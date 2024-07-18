import "./App.css";
import { useAtom } from "jotai";

interface InputTextProps {
    name: string;
    size?: number;
    min: number;
    max: number;
    atom: any;
}

export default function InputText(props: InputTextProps) {
    const [_value, setValue] = useAtom(props.atom);
    const size = props.size ? props.size : 2;
    return (
        <div className="flex flex-col gap-2">
            <div className="text-base/[17px] font-bold text-zinc-800">{props.name}</div>
            <input className={`w-[${8.5 * size}rem] h-14 pl-3 border border-black rounded-lg`} type="number" min={props.min} max={props.max} onChange={(e)=>{
                setValue(parseInt(e.target.value));
            }}></input>
        </div>
    );
}