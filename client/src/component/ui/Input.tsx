
export const Input = ({label, placeholder, onChange, type="text", value}: {
    label: string,
    placeholder: string,
    onChange : (e: any) => void,
    type: "text" | "password" | "number" | "datetime-local",
    value?: string | number
}) =>{

    return <div className="pt-2 text-gray-400">
        <div>
        * <label>{label}</label>
        </div>
        <input type={type} placeholder={placeholder} onChange={onChange} className="border rounded px-2 py-2 w-full"/>
    </div>
}