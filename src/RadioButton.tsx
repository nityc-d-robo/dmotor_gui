import { useAtom } from "jotai";
import "./App.css";

interface RadioButtonProps {
    name: string;
    group: string;
    inputList: {
        value: number;
        label: string;
    }[];
    defaultOption: number;
    atom: any;
}

export default function RadioButton(props: RadioButtonProps) {
    const [_select, setSelect] = useAtom(props.atom);
    return (
        <div className="flex flex-col gap-2 w-[8.5rem]">
            <div className="text-base/[17px] font-bold text-zinc-800">{props.name}</div>
            <div className="flex gap-4">
                {props.inputList.map((input) => (
                    <div className="flex gap-1 items-center h-14">
                        <input className="py-2" type="radio" name={props.group} value={input.value} onChange={(e)=>{
                            setSelect(parseInt(e.target.value));
                        }}/>
                        <label>{input.label}</label>
                    </div>
                ))}
            </div>
        </div>
    );
}