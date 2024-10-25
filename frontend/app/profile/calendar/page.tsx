import PopupCreationEvent from "@/components/sections/popupCreationEvent";
import Calendar from "@/components/sections/calendar";

export default function Page(){
    
    return (
        <>
        <div className="pt-16">
            <PopupCreationEvent />
            <Calendar />
        </div>
        </>
    )
}