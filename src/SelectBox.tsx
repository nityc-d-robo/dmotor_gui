import "./App.css";
import { useAtom } from "jotai";

interface SelectBoxProps {
    name: string;
    optionList: {
        id: number | string;
        name: string;
    }[];
    defaultOption: number | string;
    atom: any;
}

export default function SelectBox(props: SelectBoxProps) {
    const [_option, setOption] = useAtom(props.atom);
    return (
        <div className="flex flex-col gap-2">
            <div className="text-base/[17px] font-bold text-zinc-800">{props.name}</div>
            <select className="w-80 h-14 pl-3 border border-black rounded-lg" defaultValue={props.defaultOption} onChange={(e)=>{
                setOption(parseInt(e.target.value));
            }}>
                {props.optionList.map((option) => (
                    <option key={option.id} value={option.id}>{option.name}</option>
                ))}
            </select>
        </div>
    );
}