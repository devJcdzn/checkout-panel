"use client";

import { CountdownTimer } from "@/components/countdown-timer";
import { CustomInput } from "@/components/custom-input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetCheckout } from "@/features/checkouts/api/use-get-checkout";
import { useCreatePayment } from "@/features/payment/api/use-create-payment";
import { cn, formatCustomerTax } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  name: z
    .string({ required_error: "Preencha os campos corretamente" })
    .min(3, "Nome deve ter mais de 3 caracteres."),
  email: z
    .string({ required_error: "Preencha os campos corretamente" })
    .email("E-mail inválido"),
  tax: z.string({ required_error: "Preencha os campos corretamente" }).refine(
    (data) => {
      const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
      const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;

      return cpfRegex.test(data) || cnpjRegex.test(data);
    },
    { message: "CPF ou CNPJ inválido" }
  ),
});

type FormValues = z.input<typeof formSchema>;

export default function CheckoutPage() {
  const { hash } = useParams<{ hash: string }>();
  const { data, isLoading } = useGetCheckout(hash);
  const paymentMutation = useCreatePayment();
  const router = useRouter();

  const bgColor = data?.lightMode ? "#e4e4e4" : "#171717";
  const secondaryColor = data?.lightMode ? "#fff" : "#272727";
  const textColor = data?.lightMode ? "#000" : "#e4e4e4";
  const borderColor = data?.lightMode ? "#c4c4c4" : "#474747";

  const shouldBeRenderTimer =
    data?.timer ||
    data?.topBoxColor ||
    data?.topBoxPhrase ||
    data?.bottomBoxColor ||
    data?.bottomBoxPhrase;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    // defaultValues: defaultValues,
  });

  const handleSubmit = async (values: FormValues) => {
    const requestPaymentData = {
      customerName: values.name,
      customerEmail: values.email,
      customerTax: values.tax,
      amount: data?.product.price,
      checkoutId: data?.id,
    };
    const response = await paymentMutation.mutateAsync(requestPaymentData);
    router.push(`/payment-checkout/${response.paymentData.id}`);
  };

  if (!data || isLoading) {
    return (
      <main
        className={`flex h-full min-h-screen flex-col items-center pb-20`}
        style={{ backgroundColor: bgColor }}
      >
        <div className="mb-4"></div>
        <div className="w-full flex-col lg:w-[60rem]"></div>
        <div className="mt-8 w-full max-w-[90%] lg:max-w-[60rem]">
          <div
            className={`w-full rounded-2xl border border-[#474747] bg-[${secondaryColor}] p-4`}
          >
            <section className="flex items-start gap-4">
              <div className="relative h-[6rem] w-full max-w-[6rem] rounded-lg bg-[#b4b4b4]">
                <Skeleton className="h-full w-full rounded-lg" />
              </div>
              <section>
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-6 w-[150px]" />
                <Skeleton className="h-4 w-[80px]" />
              </section>
            </section>
          </div>

          <div
            className={`mt-4 w-full rounded-xl border border-[#474747] bg-[${secondaryColor}] p-4`}
          >
            <section className="flex items-center gap-2">
              <div
                className="flex h-6 w-6 items-center justify-center rounded-md"
                style={{ backgroundColor: "rgb(76, 175, 80)" }}
              >
                <Loader2 className="h-6 w-6 animate-spin text-[#272727]" />
              </div>
              <Skeleton className="h-6 w-[250px]" />
            </section>

            {Array(3).map((index) => (
              <div key={index} className="mt-6 flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))}
          </div>

          <div
            className={`mt-4 w-full rounded-xl border border-[#474747] bg-[${secondaryColor}] p-4`}
          >
            <section className="flex items-center gap-2">
              <div
                className="flex h-6 w-6 items-center justify-center rounded-md"
                style={{
                  backgroundColor: "rgb(76,175,80)",
                }}
              >
                <Loader2
                  className={`h-6 w-6 animate-spin text-[${secondaryColor}]`}
                />
              </div>
              <Skeleton className="h-6 w-[250px]" />
            </section>

            <div className="mt-6 flex flex-col gap-4">
              <section className="flex flex-col gap-2">
                <button
                  type="button"
                  disabled
                  className="border-green-500 text-green-500 relative  flex 
                    w-full max-w-[17rem] flex-col items-start justify-start 
                    rounded-lg border-2  p-4  duration-300 lg:hover:-translate-y-2"
                >
                  Carregando
                </button>
              </section>

              <section
                className={`mt-4 flex flex-col gap-8 rounded-md bg-[${bgColor}] px-6 py-4`}
              >
                {Array(3).map((index) => (
                  <div className="flex items-start gap-4" key={index}>
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <section>
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-4 w-[150px]" />
                      <Skeleton className="h-4 w-[100px]" />
                    </section>
                  </div>
                ))}

                <section className="flex flex-col">
                  <button
                    type="submit"
                    disabled={paymentMutation.isPending}
                    className={cn(
                      "mt-4 flex w-full cursor-pointer animate-pulse items-center justify-center gap-4 rounded-lg bg-[#1CB877] px-2 py-4 text-lg font-bold  hover:brightness-95"
                    )}
                  >
                    Carregando
                  </button>
                  <div className="mt-4 flex items-center justify-center gap-8">
                    <section className="flex gap-2 items-center">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <section className="flex flex-col gap-1">
                        <Skeleton className="h-3 w-[100px]" />
                        <Skeleton className="h-3 w-[80px]" />
                      </section>
                    </section>
                  </div>
                </section>
              </section>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main
      className={`flex h-full min-h-screen flex-col items-center bg-[${bgColor}] pb-20`}
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      <div className="mb-4 w-full lg:max-w-[60rem]">
        {shouldBeRenderTimer && (
          <CountdownTimer
            hasBottomBox={data.timer}
            bottomBox={{
              color: data.bottomBoxColor || "green",
              phrase: data.bottomBoxPhrase || "Pagamento Priorizado",
            }}
            topBox={{
              color: data.topBoxColor || "red",
              phrase: data.topBoxPhrase || "Frase de pagamento ativo",
            }}
            initialTime={data.timer}
          />
        )}
      </div>
      <div className="w-full flex-col lg:max-w-[60rem]">
        {data.banner && (
          <img
            src={data?.banner || ""}
            alt={`${data.slug}-banner`}
            className="w-full h-full max-h-[220px] object-cover"
          />
        )}
      </div>
      <div className="mt-8 w-full max-w-[90%] lg:max-w-[60rem]">
        <div
          className={`w-full rounded-2xl border border-[#474747] p-4`}
          style={{ borderColor, backgroundColor: secondaryColor }}
        >
          <section className="flex items-start gap-2">
            <div className="relative h-[6rem] w-full max-w-[6rem] rounded-lg bg-[#b4b4b4]">
              <img
                alt={`${data.product.name} - Product Image`}
                decoding="async"
                className="rounded-lg object-cover w-full h-full"
                src={data.product.image}
              />
            </div>
            <section>
              <h2 className="font-medium">{data.product.name}</h2>
              <h2 className="text-2xl font-bold text-[#1CB877]">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(data.product.price)}
              </h2>
              <h3 className="text-muted-foreground text-xs font-normal">
                No Pix
              </h3>
            </section>
          </section>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div
              className={`mt-4 w-full rounded-xl border border-[#474747] p-4`}
              style={{ borderColor, backgroundColor: secondaryColor }}
            >
              <section className="flex items-center gap-2">
                <div
                  className="flex h-6 w-6 items-center justify-center rounded-md"
                  style={{ backgroundColor: "rgb(76, 175, 80)" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    stroke="none"
                    className={`tabler-icon tabler-icon-user-filled h-4 w-4 text-[${secondaryColor}]`}
                  >
                    <path d="M12 2a5 5 0 1 1 -5 5l.005 -.217a5 5 0 0 1 4.995 -4.783z"></path>
                    <path d="M14 14a5 5 0 0 1 5 5v1a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-1a5 5 0 0 1 5 -5h4z"></path>
                  </svg>
                </div>
                <h2 className="text-lg font-semibold">Identificação</h2>
              </section>

              <div className="mt-6 flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <FormField
                    name="name"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="">Nome completo</FormLabel>
                        <div className="relative mt-2 rounded-full">
                          <div
                            className="pointer-events-none absolute inset-y-0 
                          left-0 flex items-center pl-3"
                          >
                            <svg
                              stroke="currentColor"
                              fill="currentColor"
                              strokeWidth="0"
                              viewBox="0 0 448 512"
                              className="h-[1rem] w-[1rem] text-gray-400 undefined"
                              aria-hidden="true"
                              height="1em"
                              width="1em"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"></path>
                            </svg>
                          </div>
                          <Input
                            className={`block w-full rounded-[10px] bg-[${secondaryColor}] py-[0.70rem] text-sm outline-none placeholder:text-xs placeholder:text-muted-foreground focus:ring-0 sm:text-sm sm:leading-6 pl-9 focus:border-white border border-[#474747] focus:border-[1px]`}
                            style={{
                              backgroundColor: secondaryColor,
                              borderColor,
                            }}
                            placeholder="Digite seu nome completo"
                            {...field}
                          />
                        </div>
                        <FormMessage>
                          {form.formState.errors.name?.message}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <FormField
                    name="email"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="">E-mail</FormLabel>
                        <div className="relative mt-2 rounded-full">
                          <div
                            className="pointer-events-none absolute inset-y-0 
                          left-0 flex items-center pl-3"
                          >
                            <svg
                              stroke="currentColor"
                              fill="currentColor"
                              strokeWidth="0"
                              viewBox="0 0 512 512"
                              className="h-[1rem] w-[1rem] text-gray-400 undefined"
                              aria-hidden="true"
                              height="1em"
                              width="1em"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M502.3 190.8c3.9-3.1 9.7-.2 9.7 4.7V400c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V195.6c0-5 5.7-7.8 9.7-4.7 22.4 17.4 52.1 39.5 154.1 113.6 21.1 15.4 56.7 47.8 92.2 47.6 35.7.3 72-32.8 92.3-47.6 102-74.1 131.6-96.3 154-113.7zM256 320c23.2.4 56.6-29.2 73.4-41.4 132.7-96.3 142.8-104.7 173.4-128.7 5.8-4.5 9.2-11.5 9.2-18.9v-19c0-26.5-21.5-48-48-48H48C21.5 64 0 85.5 0 112v19c0 7.4 3.4 14.3 9.2 18.9 30.6 23.9 40.7 32.4 173.4 128.7 16.8 12.2 50.2 41.8 73.4 41.4z"></path>
                            </svg>
                          </div>
                          {/* <Input
                            type="email"
                            className="block w-full rounded-[10px] 
                            bg-[#272727] py-[0.70rem] text-sm outline-none 
                            placeholder:text-xs placeholder:text-muted-foreground 
                            focus:ring-0 sm:text-sm sm:leading-6 
                            pl-9 focus:border-white border border-[#474747] 
                            focus:border-[1px]"
                            placeholder="Digite seu nome e-mail"
                            {...field}
                          /> */}
                          <CustomInput
                            type="email"
                            bgColor={secondaryColor}
                            placeholder="Digite seu e-mail"
                            className="focus:border-[rgb(76,175,80)]"
                            style={{
                              backgroundColor: secondaryColor,
                              borderColor,
                            }}
                            {...field}
                          />
                        </div>
                        <FormMessage>
                          {form.formState.errors.email?.message}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <FormField
                    name="tax"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="">CPF/CNPJ</FormLabel>
                        <div className="relative mt-2 rounded-full">
                          <div
                            className="pointer-events-none absolute inset-y-0 
                          left-0 flex items-center pl-3"
                          >
                            <svg
                              stroke="currentColor"
                              fill="currentColor"
                              strokeWidth="0"
                              viewBox="0 0 24 24"
                              className="h-[1rem] w-[1rem] text-gray-400 undefined"
                              aria-hidden="true"
                              height="1em"
                              width="1em"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path fill="none" d="M0 0h24v24H0z"></path>
                              <path d="M14 19.88V22h2.12l5.17-5.17-2.12-2.12zM20 8l-6-6H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H12v-2.95l8-8V8zm-7 1V3.5L18.5 9H13zM22.71 14l-.71-.71a.996.996 0 0 0-1.41 0l-.71.71L22 16.12l.71-.71a.996.996 0 0 0 0-1.41z"></path>
                            </svg>
                          </div>
                          {/* <Input
                            className=" block w-full rounded-[10px] 
                            bg-[#272727] py-[0.70rem] text-sm outline-none 
                            placeholder:text-xs placeholder:text-muted-foreground 
                            focus:ring-0 sm:text-sm sm:leading-6 
                            pl-9 focus:border-white border border-[#474747] 
                            focus:border-[1px]"
                            placeholder="Digite seu CPF/CNPJ"
                            {...field}
                            onChange={(e) => {
                              const formattedValue = formatCustomerTax(
                                e.target.value
                              );
                              field.onChange(formattedValue);
                            }}
                          /> */}
                          <CustomInput
                            {...field}
                            bgColor={secondaryColor}
                            placeholder="Digite seu CPF/CNPJ"
                            style={{
                              backgroundColor: secondaryColor,
                              borderColor,
                            }}
                            onChange={(e) => {
                              const formattedValue = formatCustomerTax(
                                e.target.value
                              );
                              field.onChange(formattedValue);
                            }}
                          />
                        </div>
                        <FormMessage>
                          {form.formState.errors.tax?.message}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <div
              className={`mt-4 w-full rounded-xl border border-[#474747] bg-[${secondaryColor}] p-4`}
              style={{ borderColor, backgroundColor: secondaryColor }}
            >
              <section className="flex items-center gap-2">
                <div
                  className="flex h-6 w-6 items-center justify-center rounded-md"
                  style={{
                    backgroundColor: "rgb(76,175,80)",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    stroke="none"
                    className={`tabler-icon tabler-icon-credit-card-filled h-4 w-4 text-[${secondaryColor}]`}
                  >
                    <path d="M22 10v6a4 4 0 0 1 -4 4h-12a4 4 0 0 1 -4 -4v-6h20zm-14.99 4h-.01a1 1 0 1 0 .01 2a1 1 0 0 0 0 -2zm5.99 0h-2a1 1 0 0 0 0 2h2a1 1 0 0 0 0 -2zm5 -10a4 4 0 0 1 4 4h-20a4 4 0 0 1 4 -4h12z"></path>
                  </svg>
                </div>
                <h2 className="text-lg font-semibold ">Pagamento</h2>
              </section>

              <div className="mt-6 flex flex-col gap-4">
                <section className="flex flex-col gap-2">
                  <button
                    type="button"
                    className="border-green-500 text-green-500 relative  flex 
                    w-full max-w-[17rem] flex-col items-start justify-start 
                    rounded-lg border-2  p-4  duration-300 lg:hover:-translate-y-2"
                  >
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth="0"
                      viewBox="0 0 512 512"
                      className="h-5 w-5 text-inherit "
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M242.4 292.5C247.8 287.1 257.1 287.1 262.5 292.5L339.5 369.5C353.7 383.7 372.6 391.5 392.6 391.5H407.7L310.6 488.6C280.3 518.1 231.1 518.1 200.8 488.6L103.3 391.2H112.6C132.6 391.2 151.5 383.4 165.7 369.2L242.4 292.5zM262.5 218.9C256.1 224.4 247.9 224.5 242.4 218.9L165.7 142.2C151.5 127.1 132.6 120.2 112.6 120.2H103.3L200.7 22.76C231.1-7.586 280.3-7.586 310.6 22.76L407.8 119.9H392.6C372.6 119.9 353.7 127.7 339.5 141.9L262.5 218.9zM112.6 142.7C126.4 142.7 139.1 148.3 149.7 158.1L226.4 234.8C233.6 241.1 243 245.6 252.5 245.6C261.9 245.6 271.3 241.1 278.5 234.8L355.5 157.8C365.3 148.1 378.8 142.5 392.6 142.5H430.3L488.6 200.8C518.9 231.1 518.9 280.3 488.6 310.6L430.3 368.9H392.6C378.8 368.9 365.3 363.3 355.5 353.5L278.5 276.5C264.6 262.6 240.3 262.6 226.4 276.6L149.7 353.2C139.1 363 126.4 368.6 112.6 368.6H80.78L22.76 310.6C-7.586 280.3-7.586 231.1 22.76 200.8L80.78 142.7H112.6z"></path>
                    </svg>
                    <label className="text-sm font-normal text-inherit lg:text-base">
                      Pix
                    </label>

                    <div
                      className="absolute right-[-1.5rem] top-[-1.5rem] z-50 
                    flex h-14 w-14 items-center justify-center rounded-full  p-0.5"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        stroke="none"
                        className="tabler-icon tabler-icon-circle-check-filled "
                      >
                        <path d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-1.293 5.953a1 1 0 0 0 -1.32 -.083l-.094 .083l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.403 1.403l.083 .094l2 2l.094 .083a1 1 0 0 0 1.226 0l.094 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z"></path>
                      </svg>
                    </div>
                  </button>
                </section>

                <section
                  className={`mt-4 flex flex-col gap-8 rounded-md px-6 py-4`}
                  style={{ backgroundColor: bgColor }}
                >
                  <div className="flex items-start gap-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="tabler-icon tabler-icon-bolt h-8 w-8 text-blue-500 "
                    >
                      <path d="M13 3l0 7l6 0l-8 11l0 -7l-6 0l8 -11"></path>
                    </svg>
                    <section>
                      <h2 className="font-semibold text-blue-500">Imediato</h2>
                      <span className=" text-sm">
                        Ao selecionar a opção Gerar Pix o código para pagamento
                        estará disponível.
                      </span>
                    </section>
                  </div>
                  <div className="flex items-start gap-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="tabler-icon tabler-icon-qrcode h-8 w-8 text-vanguard-blue-400 "
                    >
                      <path d="M4 4m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z"></path>
                      <path d="M7 17l0 .01"></path>
                      <path d="M14 4m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z"></path>
                      <path d="M7 7l0 .01"></path>
                      <path d="M4 14m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z"></path>
                      <path d="M17 7l0 .01"></path>
                      <path d="M14 14l3 0"></path>
                      <path d="M20 14l0 .01"></path>
                      <path d="M14 14l0 3"></path>
                      <path d="M14 20l3 0"></path>
                      <path d="M17 17l3 0"></path>
                      <path d="M20 17l0 3"></path>
                    </svg>
                    <section>
                      <h2 className="font-semibold text-blue-500">
                        Pagamento Simples
                      </h2>
                      <span className=" text-sm">
                        Para pagar basta abrir o aplicativo do seu banco,
                        procurar pelo PIX e escanear o QRcode.
                      </span>
                    </section>
                  </div>
                  <div className="flex items-start gap-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="tabler-icon tabler-icon-shield-check h-8 w-8 text-blue-500 "
                    >
                      <path d="M11.46 20.846a12 12 0 0 1 -7.96 -14.846a12 12 0 0 0 8.5 -3a12 12 0 0 0 8.5 3a12 12 0 0 1 -.09 7.06"></path>
                      <path d="M15 19l2 2l4 -4"></path>
                    </svg>
                    <section>
                      <h2 className="font-semibold text-blue-500">
                        100% Seguro
                      </h2>
                      <span className=" text-sm">
                        O pagamento com PIX foi desenvolvido pelo Banco Central
                        para facilitar suas compras.
                      </span>
                    </section>
                  </div>

                  <section className="mt-2 flex items-center justify-between gap-2 ">
                    <h3 className="text-lg font-semibold">Valor total:</h3>
                    <h3 className="text-lg font-semibold  ">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(data.product.price)}
                    </h3>
                  </section>

                  <section className="flex flex-col">
                    <button
                      type="submit"
                      disabled={paymentMutation.isPending}
                      className={cn(
                        "mt-4 flex w-full cursor-pointer text-white items-center justify-center gap-4 rounded-lg bg-[#1CB877] px-2 py-4 text-lg font-bold  hover:brightness-95"
                      )}
                    >
                      {paymentMutation.isPending
                        ? "Carregando..."
                        : "FINALIZAR PAGAMENTO"}
                    </button>
                    <div className="mt-4 flex items-center justify-center gap-8">
                      <section className="flex gap-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          stroke="none"
                          className="tabler-icon tabler-icon-shield-check-filled text-muted-foreground h-8 w-8"
                        >
                          <path d="M11.998 2l.118 .007l.059 .008l.061 .013l.111 .034a.993 .993 0 0 1 .217 .112l.104 .082l.255 .218a11 11 0 0 0 7.189 2.537l.342 -.01a1 1 0 0 1 1.005 .717a13 13 0 0 1 -9.208 16.25a1 1 0 0 1 -.502 0a13 13 0 0 1 -9.209 -16.25a1 1 0 0 1 1.005 -.717a11 11 0 0 0 7.531 -2.527l.263 -.225l.096 -.075a.993 .993 0 0 1 .217 -.112l.112 -.034a.97 .97 0 0 1 .119 -.021l.115 -.007zm3.71 7.293a1 1 0 0 0 -1.415 0l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.32 1.497l2 2l.094 .083a1 1 0 0 0 1.32 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z"></path>
                        </svg>
                        <section className="flex flex-col">
                          <span className="text-muted-foreground text-sm font-normal leading-4">
                            Dados 100%
                          </span>
                          <span className="text-muted-foreground text-sm font-semibold leading-4">
                            Protegidos
                          </span>
                        </section>
                      </section>
                    </div>
                  </section>
                </section>
              </div>
            </div>
          </form>
        </Form>
      </div>
      <div className="w-full flex-col mt-2 lg:max-w-[60rem]">
        {data.bottomBanner && (
          <img
            src={data?.bottomBanner || ""}
            alt={`${data.slug}-bottomBanner`}
            className="w-full h-full max-h-[220px] object-cover"
          />
        )}
      </div>
      {data.testimonials && (
        <div
          className="w-full flex-col max-w-[90%] lg:max-w-[60rem] mt-3 p-2 rounded-xl"
          style={{ backgroundColor: secondaryColor }}
        >
          <img
            src={data?.testimonials}
            alt={`${data.slug}-testimonials`}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="mb-8 mt-4 flex flex-col items-center gap-1">
        <section className="flex flex-col items-center">
          <h2 className="text-xs font-normal text-muted-foreground ">
            Pagamento seguro.
          </h2>
          <h2 className="text-xs font-normal text-muted-foreground ">
            Todos os direitos reservados
          </h2>
        </section>
      </div>
    </main>
  );
}
