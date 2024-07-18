import { invoke } from '@tauri-apps/api'

import "./App.css";
import { useAtom } from "jotai";
import { BoardAddressAtom, MdModeAtom, MdPhaseAtom, MdLimSwAtom, MdCommandValueAtom } from "./Jotai";
import SelectBox from "./SelectBox";
import InputText from "./InputText";
import RadioButton from "./RadioButton";
import { Button } from "./Button";

function WriteButton(){
    const address = useAtom(BoardAddressAtom)[0];
    const mode = useAtom(MdModeAtom)[0];
    const phase = useAtom(MdPhaseAtom)[0];
    const limsw = useAtom(MdLimSwAtom)[0];
    const value = useAtom(MdCommandValueAtom)[0];

    return <Button onClick={async () => {
        console.log(address, mode, phase, value);
        await invoke("send_md", {
            command:{
                address: address,
                mode: mode,
                phase: phase,
                limsw: limsw,
                value: value
            }
        })
    }}>Write</Button>
}

function Pwm() {
    return (
        <div className="flex flex-col gap-4">
            <RadioButton
                name="Phase"
                group="phase"
                inputList={[
                    { value: 0, label: "CCW" },
                    { value: 1, label: "CW" },
                ]}
                defaultOption={0}
                atom={MdPhaseAtom}
            />
            <div className="flex gap-12">
                <InputText name="Power" size={1} min={0} max={1024} atom={MdCommandValueAtom}/>
                <WriteButton/>
            </div>
        </div>
    );
}

function Speed() {
    return (
        <div className="flex flex-col gap-4">
            <RadioButton
                name="Phase"
                group="phase"
                inputList={[
                    { value: 0, label: "CCW" },
                    { value: 1, label: "CW" },
                ]}
                defaultOption={0}
                atom={MdPhaseAtom}
            />
            <div className="flex gap-12">
                <InputText name="Speed(rpm)" size={1} min={0} max={1024} atom={MdCommandValueAtom}/>
                <WriteButton/>
            </div>
        </div>
    );
}

function Angle() {
    return (
        <div className="flex flex-col gap-4">
            <RadioButton
                name="Phase"
                group="phase"
                inputList={[
                    { value: 0, label: "CCW" },
                    { value: 1, label: "CW" },
                ]}
                defaultOption={0}
                atom={MdPhaseAtom}
            />
            <div className="flex gap-12">
                <InputText name="Angle(degree)" size={1} min={0} max={1024} atom={MdCommandValueAtom}/>
                <WriteButton/>
            </div>
        </div>
    );
}

function LimSW() {
    return (
        <div  className="flex flex-col gap-4">
            <div className="flex gap-12">
                <RadioButton
                    name="Phase"
                    group="phase"
                    inputList={[
                        { value: 0, label: "CCW" },
                        { value: 1, label: "CW" },
                    ]}
                    defaultOption={0}
                    atom={MdPhaseAtom}
                />
                <RadioButton
                    name="LimSW Port"
                    group="port"
                    inputList={[
                        { value: 0, label: "CCW" },
                        { value: 1, label: "CW" },
                    ]}
                    defaultOption={0}
                    atom={MdLimSwAtom}
                />
            </div>
            <div className="flex gap-12">
                <InputText name="Speed(rpm)" size={1} min={0} max={1024} atom={MdCommandValueAtom}/>
                <WriteButton/>
            </div>
        </div>
    );
}


export default function MD() {
    const [mode] = useAtom(MdModeAtom);
    return (
        <div className="flex flex-col gap-4">
            <SelectBox
                name="Mode"
                optionList={[
                    { id: 0, name: "Init" },
                    { id: 1, name: "Status" },
                    { id: 2, name: "PWM" },
                    { id: 3, name: "Speed" },
                    { id: 4, name: "Angle" },
                    { id: 5, name: "Limit Switch" },
                ]}
                defaultOption={mode}
                atom={MdModeAtom}
            />
            {(() => {
                switch (mode) {
                    case 2:
                        return <Pwm />
                    case 3:
                        return <Speed />
                    case 4:
                        return <Angle />
                    case 5:
                        return <LimSW />
                    default:
                        return <div></div>
                }
            })()}
        </div>
    );
}