import { useSortable} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
export const SortablePlanCard = ({plan,children}) => {
    const {
        attributes,
        listeners,
        transform,
        transition,
        setNodeRef
    } = useSortable({id : plan.id})

     const style = {
        transform: CSS.Transform.toString(transform),
        transition,
      };
    return (
        <div
        ref={setNodeRef}
        style={style}
        >
         {children({ attributes, listeners })}
        </div>
    )
}