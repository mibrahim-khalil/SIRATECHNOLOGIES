import { ListChecks } from "lucide-react";
import SimpleCrudPage from "../components/ui/SimpleCrudPage";

export default function ManageProcess() {
  return (
    <SimpleCrudPage
      apiPath="/process"
      singular="Step"
      plural="Process Steps"
      emptyIcon={ListChecks}
      emptyTitle="No process steps yet"
      getTitle={(item) => `${item.number} · ${item.title}`}
      getPreview={(item) => item.description}
      defaultValues={{
        number: "",
        title: "",
        description: "",
        order: 0,
        isActive: true,
      }}
      fields={[
        {
          name: "number",
          label: "Step number",
          placeholder: "01",
          required: true,
          hint: "Displayed as-is (e.g. 01, 02, Step 1)",
        },
        {
          name: "title",
          label: "Title",
          placeholder: "Discover",
          required: true,
        },
        {
          name: "description",
          label: "Description",
          type: "textarea",
          rows: 3,
          placeholder: "We clarify goals, users, scope...",
          required: true,
        },
        { name: "order", label: "Display order", type: "number" },
        { name: "isActive", label: "Status", type: "toggle" },
      ]}
    />
  );
}