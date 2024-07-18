import "./App.css";
import SelectBox from "./SelectBox";
import InputText from "./InputText";
import MD from "./MD";
import BLMD from "./BLMD";
import { BoardAddressAtom, BoardTypeAtom, SemiMasterIdAtom } from "./Jotai";
import { useAtom } from "jotai";
import { Button } from "./Button";

function App() {
  const [boardType] = useAtom(BoardTypeAtom);
  return (
    <div className="flex flex-col gap-4 px-10 pt-5">
      <div className="flex justify-between">
        <div className="flex flex-col gap-4">
          <SelectBox
            name="Board Type"
            optionList={[
              { id: 0x00, name: "MD" },
              { id: 0x10, name: "SD" },
              { id: 0x20, name: "SMD" },
              { id: 0x30, name: "BLMD" },
              { id: 0x40, name: "SR" },
              { id: 0x50, name: "SM" },
              { id: 0x60, name: "MASTER" },
            ]}
            defaultOption={1}
            atom={BoardTypeAtom}
          />
          <InputText name="Board Address" min={0} max={15} atom={BoardAddressAtom}/>
          <InputText name="SemiMaster ID" min={0} max={15} atom={SemiMasterIdAtom}/>
        </div>
        <div>
          {(() => {
            switch (boardType) {
              case 0x00:
                return <MD />
              case 0x30:
                return <BLMD />
              default:
                return <div></div>
            }
          })()}
        </div>
      </div>
      <div className="flex gap-12">
        <textarea className="resize-none min-w-[28.5rem] grow pl-3 border border-black rounded-lg"></textarea>
        <div className="flex flex-col gap-4">
          <Button>View Graph</Button>
          <Button color="Red">Emergency</Button>
        </div>
      </div>
    </div>
  );
}

export default App;
