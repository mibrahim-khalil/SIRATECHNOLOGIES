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
          options: [
            { value: "general", label: "General" },
            { value: "pricing", label: "Pricing" },
            { value: "help", label: "Help" },
            { value: "process", label: "Process" },
          ],
        },
        { name: "order", label: "Display order", type: "number" },
        { name: "isActive", label: "Status", type: "toggle" },
      ]}
    />
  );
}