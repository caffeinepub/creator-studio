import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Sparkles, Upload, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

export interface VideoOption {
  title: string;
  price: number;
  description: string;
  emoji: string;
}

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
  selectedOption: VideoOption | null;
}

interface FormData {
  yourName: string;
  recipientName: string;
  message: string;
  email: string;
  file: File | null;
}

const initialForm: FormData = {
  yourName: "",
  recipientName: "",
  message: "",
  email: "",
  file: null,
};

export default function BookingModal({
  open,
  onClose,
  selectedOption,
}: BookingModalProps) {
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {},
  );
  const [submitted, setSubmitted] = useState(false);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (!form.yourName.trim()) newErrors.yourName = "Please enter your name";
    if (!form.recipientName.trim())
      newErrors.recipientName = "Please enter who this video is for";
    if (!form.message.trim())
      newErrors.message = "Please add a message or instructions";
    if (!form.email.trim()) newErrors.email = "Please enter your email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Please enter a valid email";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setSubmitted(true);
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setForm(initialForm);
      setErrors({});
      setSubmitted(false);
    }, 300);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setForm((prev) => ({ ...prev, file }));
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent
        data-ocid="booking_form.dialog"
        className="max-w-lg w-full max-h-[90vh] overflow-y-auto p-0 gap-0 rounded-2xl border-0"
      >
        {/* Header */}
        <div
          className="relative px-6 pt-6 pb-5 rounded-t-2xl"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.42 0.22 245) 0%, oklch(0.60 0.18 220) 100%)",
          }}
        >
          <button
            type="button"
            data-ocid="booking_form.close_button"
            onClick={handleClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
          <DialogHeader>
            <DialogTitle className="text-white font-display text-xl font-bold">
              {selectedOption ? (
                <span>
                  {selectedOption.emoji} {selectedOption.title}
                </span>
              ) : (
                "Book Your Video"
              )}
            </DialogTitle>
            {selectedOption && (
              <p className="text-white/80 text-sm font-body mt-1">
                {selectedOption.description}
              </p>
            )}
          </DialogHeader>
          {selectedOption && (
            <div className="mt-3 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5">
              <span className="text-white font-bold text-lg">
                ${selectedOption.price}
              </span>
              <span className="text-white/70 text-sm">one-time</span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                data-ocid="booking_form.success_state"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, ease: "backOut" }}
                className="flex flex-col items-center justify-center py-8 text-center gap-4"
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ background: "oklch(0.88 0.15 145 / 0.2)" }}
                >
                  <CheckCircle2
                    className="w-9 h-9"
                    style={{ color: "oklch(0.55 0.18 145)" }}
                  />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-foreground mb-2">
                    Request Sent! 🎉
                  </h3>
                  <p className="text-muted-foreground font-body text-sm leading-relaxed">
                    Your request has been sent! Florida Dave will be in touch
                    soon. <br />
                    Keep an eye on <strong>{form.email}</strong> for updates.
                  </p>
                </div>
                <Button
                  onClick={handleClose}
                  className="mt-2 rounded-full px-8"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.42 0.22 245) 0%, oklch(0.60 0.18 220) 100%)",
                    color: "white",
                  }}
                >
                  Awesome, Thanks! 🤙
                </Button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSubmit}
                className="space-y-4"
                noValidate
              >
                {/* Your Name */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="yourName"
                    className="font-body text-sm font-semibold"
                  >
                    Your Name *
                  </Label>
                  <Input
                    id="yourName"
                    data-ocid="booking_form.name_input"
                    placeholder="e.g. Mike Johnson"
                    value={form.yourName}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, yourName: e.target.value }))
                    }
                    className={errors.yourName ? "border-destructive" : ""}
                  />
                  {errors.yourName && (
                    <p className="text-destructive text-xs font-body">
                      {errors.yourName}
                    </p>
                  )}
                </div>

                {/* Recipient Name */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="recipientName"
                    className="font-body text-sm font-semibold"
                  >
                    Who is this video for? *
                  </Label>
                  <Input
                    id="recipientName"
                    data-ocid="booking_form.recipient_input"
                    placeholder="e.g. Sarah (my best friend)"
                    value={form.recipientName}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        recipientName: e.target.value,
                      }))
                    }
                    className={errors.recipientName ? "border-destructive" : ""}
                  />
                  {errors.recipientName && (
                    <p className="text-destructive text-xs font-body">
                      {errors.recipientName}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="message"
                    className="font-body text-sm font-semibold"
                  >
                    Your message / special instructions *
                  </Label>
                  <Textarea
                    id="message"
                    data-ocid="booking_form.message_textarea"
                    placeholder="Tell Florida Dave what to say! Include any inside jokes, details, or specific requests..."
                    value={form.message}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, message: e.target.value }))
                    }
                    className={`min-h-[100px] resize-none font-body ${errors.message ? "border-destructive" : ""}`}
                  />
                  {errors.message && (
                    <p className="text-destructive text-xs font-body">
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="email"
                    className="font-body text-sm font-semibold"
                  >
                    Email address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    data-ocid="booking_form.email_input"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, email: e.target.value }))
                    }
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && (
                    <p className="text-destructive text-xs font-body">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* File Upload */}
                <div className="space-y-1.5">
                  <Label className="font-body text-sm font-semibold">
                    Optional: Upload a photo or note
                  </Label>
                  <label
                    data-ocid="booking_form.upload_button"
                    className="flex items-center gap-3 border-2 border-dashed rounded-xl p-3 cursor-pointer transition-colors hover:border-primary/60"
                    style={{ borderColor: "oklch(0.52 0.19 240 / 0.3)" }}
                  >
                    <Upload
                      size={18}
                      className="text-muted-foreground shrink-0"
                    />
                    <span className="text-sm font-body text-muted-foreground">
                      {form.file
                        ? form.file.name
                        : "Click to upload (optional)"}
                    </span>
                    <input
                      type="file"
                      accept="image/*,.pdf,.txt"
                      className="sr-only"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>

                {/* PayPal Payment */}
                <div
                  className="rounded-xl p-4 border"
                  style={{
                    background: "oklch(0.97 0.02 220 / 0.5)",
                    borderColor: "oklch(0.75 0.12 240 / 0.4)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        d="M19.5 6.5C19.5 9.81 16.81 12.5 13.5 12.5H10.5L9 19H6L8.5 6.5H13.5C16.81 6.5 19.5 3.81 19.5 0.5"
                        fill="#003087"
                      />
                      <path
                        d="M17 9C17 12.31 14.31 15 11 15H8L6.5 21.5H3.5L6 9H11C14.31 9 17 6.19 17 3"
                        fill="#009cde"
                      />
                    </svg>
                    <span
                      className="font-display text-sm font-bold"
                      style={{ color: "oklch(0.25 0.12 240)" }}
                    >
                      Pay with PayPal
                    </span>
                    {selectedOption && (
                      <span
                        className="ml-auto font-bold text-sm"
                        style={{ color: "oklch(0.25 0.12 240)" }}
                      >
                        ${selectedOption.price}.00
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    data-ocid="booking_form.paypal_button"
                    onClick={() => {
                      if (!selectedOption) return;
                      const encodedTitle = encodeURIComponent(
                        selectedOption.title,
                      );
                      const url = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=davidmcfddn77%40gmail.com&amount=${selectedOption.price}&currency_code=USD&item_name=${encodedTitle}`;
                      window.open(url, "_blank");
                    }}
                    className="w-full rounded-xl py-3 text-white font-display font-bold text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98]"
                    style={{
                      background:
                        "linear-gradient(135deg, #003087 0%, #009cde 100%)",
                    }}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="white"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path d="M20.067 7.301C19.981 5.077 18.254 3.5 15.5 3.5H8.5C8.224 3.5 7.987 3.696 7.944 3.969L5.444 18.969C5.412 19.17 5.567 19.352 5.771 19.352H9.5L10.5 13.5H13.5C17.365 13.5 20.2 10.829 20.067 7.301Z" />
                    </svg>
                    Pay ${selectedOption?.price ?? "—"} with PayPal
                  </button>
                  <p
                    className="text-center text-xs font-body mt-2"
                    style={{ color: "oklch(0.45 0.1 240)" }}
                  >
                    Include your name + video type in the PayPal payment note.
                  </p>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  data-ocid="booking_form.submit_button"
                  className="w-full rounded-xl py-3 font-display font-bold text-base flex items-center justify-center gap-2"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.42 0.22 245) 0%, oklch(0.58 0.2 220) 100%)",
                    color: "white",
                  }}
                >
                  <Sparkles size={16} />
                  Send Request 🎬
                </Button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
