import { PlusCircle } from "lucide-react";
import SimpleCrudPage from "../components/ui/SimpleCrudPage";

export default function ManageAddons() {
  return (
    <SimpleCrudPage
      apiPath="/addons"
      singular="Add-on"
      plural="Add-ons"
      emptyIcon={PlusCircle}
      emptyTitle="No add-ons yet"
      getTitle={(item) => `${item.title} — ${item.price}`}
      getPreview={(item) => item.description}
      defaultValues={{
        title: "",
        price: "",
        description: "",
        order: 0,
        isActive: true,
      }}
      fields={[
        {
          name: "title",
          label: "Title",
          placeholder: "Logo + Brand Kit",
          required: true,
        },
        {
          name: "price",
          label: "Price",
          placeholder: "$49+",
          required: true,
          hint: "Free text (e.g. $99+, From $500)",
        },
        {
          name: "description",
          label: "Description",
          type: "textarea",
          rows: 3,
          placeholder: "Logo, colors, typography...",
          required: true,
        },
        { name: "order", label: "Display order", type: "number" },
        { name: "isActive", label: "Status", type: "toggle" },
      ]}
    />
  );
}