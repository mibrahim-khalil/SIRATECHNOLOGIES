import { HelpCircle } from "lucide-react";
import SimpleCrudPage from "../components/ui/SimpleCrudPage";

export default function ManageFAQs() {
  return (
    <SimpleCrudPage
      apiPath="/faqs"
      singular="FAQ"
      plural="FAQs"
      emptyIcon={HelpCircle}
      emptyTitle="No FAQs yet"
      getTitle={(item) => item.question}
      getPreview={(item) => item.answer}
      getMeta={(item) => item.category}
      defaultValues={{
        question: "",
        answer: "",
        category: "general",
        order: 0,
        isActive: true,
      }}
      fields={[
        {
          name: "question",
          label: "Question",
          placeholder: "How do we start working together?",
          required: true,
        },
        {
          name: "answer",
          label: "Answer",
          type: "textarea",
          rows: 4,
          placeholder: "Send your requirements via Start a Project...",
          required: true,
        },
        {
          name: "category",
          label: "Category",
          type: "select",
          hint: "Choose where this FAQ appears on the public site",
          options: [
            { value: "general", label: "General (shows on Help page)" },
            { value: "services", label: "Services (Services page)" },
            { value: "pricing", label: "Pricing (Pricing page)" },
            { value: "process", label: "Process (About/Process pages)" },
            { value: "support", label: "Support (Help page)" },
            { value: "help", label: "Help (Help page)" },
          ],
        },
        { name: "order", label: "Display order", type: "number" },
        { name: "isActive", label: "Status", type: "toggle" },
      ]}
    />
  );
}