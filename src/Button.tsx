type ButtonColor = "Red" | "Blue";

interface ButtonProps {
    children: React.ReactNode;
    color?: ButtonColor;
    mt?: 1.55;
    onClick?: () => void;
}

export function Button(props: ButtonProps) {
    const colorStyle = props.color == "Red" ? "text-red-700 border-red-700" : "text-blue-700 border-blue-700";
    const marginStyle = props.mt == 1.55 ? `mt-[1.55rem]` : "mt-auto";
    return <button className={`w-[8.5rem] h-14 p-4 ${marginStyle} ml-auto border rounded-lg ${colorStyle}`} onClick={props.onClick}>{props.children}</button>
}