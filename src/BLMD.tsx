import { invoke } from '@tauri-apps/api'

import "./App.css";
import { useAtom } from "jotai";
import { BoardAddressAtom, BlMdModeAtom, BlMdCommandValueAtom } from "./Jotai";
import SelectBox from "./SelectBox";
import InputText from "./InputText";
import { Button } from "./Button";

function WriteButton(){
    const controller_id = useAtom(BoardAddressAtom)[0];
    const mode = useAtom(BlMdModeAtom)[0];
    const value = useAtom(BlMdCommandValueAtom)[0];

    return <Button mt={1.55} onClick={async () =>{
        console.log(controller_id, mode, value);
        await invoke("send_blmd", {
            command:{
                controller_id: controller_id,
                mode: mode,
                value: value
            }
        })
    }}>Write</Button>
}

function Current() {
    return (
        <div className="flex flex-col gap-4">
            <InputText name="Current" min={-16384} max={16384} atom={BlMdCommandValueAtom}/>
            <WriteButton/>
        </div>
    );
}

function Speed() {
    return (
        <div className="flex flex-col gap-4">
            <InputText name="Speed(rpm)" min={-16384} max={16384} atom={BlMdCommandValueAtom}/>
            <WriteButton/>
        </div>
    );
}

function Angle() {
    return (
        <div className="flex flex-col gap-4">
            <InputText name="Angle(degree)" min={-360} max={360} atom={BlMdCommandValueAtom}/>
            <WriteButton/>
        </div>
    );
}


export default function BLMD() {
    const [mode] = useAtom(BlMdModeAtom);
    return (
        <div className="flex flex-col gap-4">
            <div>
                <SelectBox
                    name="Mode"
                    optionList={[
                        { id: 0, name: "Init" },
                        { id: 1, name: "Status" },
                        { id: 2, name: "Current" },
                        { id: 3, name: "Speed" },
                        { id: 4, name: "Angle" },
                    ]}
                    defaultOption={mode}
                    atom={BlMdModeAtom}
                />
            </div>
            {(()=>{
                switch (mode) {
                    case 2:
                        return <Current/>
                    case 3:
                        return <Speed/>
                    case 4:
                        return <Angle/>
                    default:
                        return <div></div>
                }
            })()}
        </div>
    );
}