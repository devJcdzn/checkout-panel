"use client";

import { Button } from "@/components/ui/button";
import { useGetPayment } from "@/features/payment/api/use-get-payment";
import { useToast } from "@/hooks/use-toast";
import { cn, formatCurrency } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import Countdown from "./_components/countdown";
import { useEffect, useState } from "react";
// import { useCreatePayment } from "@/features/payment/api/use-create-payment";
import { ReloadIcon } from "@radix-ui/react-icons";
import { checkPaymentStatus } from "@/actions";
import { Skeleton } from "@/components/ui/skeleton";

export default function CheckoutPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { paymentId } = useParams<{ paymentId: string }>();

  const { data, isLoading } = useGetPayment(paymentId);

  const [isExpired, setIsExpired] = useState<boolean>(false);

  const bgColor = data?.checkout?.lightMode ? "#e4e4e4" : "#171717";
  const secondaryColor = data?.checkout?.lightMode ? "#fff" : "#272727";
  const textColor = data?.checkout?.lightMode ? "#000" : "#e4e4e4";
  const borderColor = data?.checkout?.lightMode ? "#c4c4c4" : "#474747";

  const copyPaymentCodeToClipboard = () => {
    navigator.clipboard
      .writeText(data?.paymentCode)
      .then(() => {
        toast({
          title: "Código de pagamento copiado!",
        });
      })
      .catch((err) => {
        toast({
          title: "Erro ao copiar código de pagamento",
          description: err,
          variant: "destructive",
        });
      });
  };

  const handleExpire = (expired: boolean) => {
    setIsExpired(expired);
  };

  useEffect(() => {
    if (!isLoading && data) {
      const currentTime = new Date().getTime();
      const expirationTime =
        new Date(data.createdAt).getTime() + 15 * 60 * 1000;

      if (currentTime > expirationTime || isExpired) {
        toast({
          title: "Tempo expirado",
          description: "Seu tempo de pagamento expirou.",
          variant: "destructive",
        });
        router.push(`/checkout/${data?.checkout?.hash}`);
      }
    }
  }, [data, isLoading, router, toast, isExpired]);

  const getPaymentStatus = async () => {
    try {
      const isPayed = await checkPaymentStatus(paymentId);

      if (isPayed) {
        router.replace(data?.checkout?.redirectLink || `/success`);
        toast({
          title: "Pagamento realizado com sucesso!",
        });
      }
    } catch (error) {
      console.error("Erro ao verificar o status do pagamento:", error);
      toast({
        title: "Erro ao verificar status do pagamento",
        description: (error as Error).message || "Erro desconhecido",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      getPaymentStatus();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [paymentId, data, router]);

  if (!data || isLoading) {
    return (
      <main
        className="flex h-full min-h-screen flex-col items-center bg-[#171717] pb-20"
        style={{ backgroundColor: bgColor, color: textColor }}
      >
        <div className="flex w-full max-w-[75rem] flex-col px-4 sm:px-0">
          <section className="flex w-full flex-col items-center justify-between py-6 sm:py-8 md:flex-row">
            <div className="flex w-full items-center gap-4">
              <Button
                onClick={() => router.back()}
                className="flex h-10 w-10 items-center justify-center gap-2 rounded-[10px] border text-sm font-bold bg-transparent hover:bg-transparent"
              >
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
                  className="tabler-icon tabler-icon-arrow-back h-5 w-5 "
                >
                  <path d="M9 11l-4 4l4 4m-4 -4h11a4 4 0 0 0 0 -8h-1"></path>
                </svg>
              </Button>
              <h1 className="text-2xl font-bold sm:text-4xl">
                Detalhes do pedido
              </h1>
            </div>
          </section>
          <div className="flex w-full flex-col gap-8 rounded-xl border p-6 sm:p-10">
            <div className="w-ful flex flex-col gap-8 md:flex-row md:gap-12">
              <div className="flex w-full flex-col justify-start gap-8 sm:gap-12">
                <h1 className="max-w-[25rem] text-left text-3xl font-bold sm:text-4xl">
                  Digitalize o <span className="text-blue-400">QR Code </span>
                  com seu smartphone
                </h1>
                <section className="">
                  <h3 className="text-muted-foreground">Valor</h3>
                  <h1 className="text-white text-4xl font-bold">
                    <Skeleton className="h-6 w-[260px]" />
                  </h1>
                </section>

                <section className="flex w-fit flex-col">
                  <h3 className="text-muted-foreground text-lg font-semibold sm:text-xl">
                    Tempo restante para pagamento
                  </h3>
                  <Skeleton className="h-10 w-[350px]" />
                </section>

                <div className="flex w-full max-w-[32rem]  flex-col items-start  justify-start">
                  <h3 className="text-white font-bold">Instruções</h3>
                  <section className="mt-4 flex w-full gap-2">
                    <div className="flex h-[1.5rem] w-full max-w-[1.5rem] items-center justify-center rounded-lg bg-blue-400 font-semibold text-white">
                      1
                    </div>
                    <h3 className="text-muted-foreground">
                      Abra o app do seu banco preferido e selecione a opção PIX
                    </h3>
                  </section>
                  <section className="mt-4 flex w-full gap-2">
                    <div className="flex h-[1.5rem] w-full max-w-[1.5rem] items-center justify-center rounded-lg bg-blue-400 font-semibold text-white">
                      2
                    </div>
                    <h3 className="text-muted-foreground">
                      Selecione a opção <b>Pix Copia e Cola</b> com o código do
                      pix copiado e cole o código
                    </h3>
                  </section>
                  <section className="mt-4 flex w-full gap-2">
                    <div className="flex h-[1.5rem] w-full max-w-[1.5rem] items-center justify-center rounded-lg bg-blue-400 font-semibold text-white">
                      3
                    </div>
                    <h3 className="text-muted-foreground">
                      Por fim, clique em confirmar pagamento
                    </h3>
                  </section>
                </div>
              </div>

              <div className="flex w-full flex-col">
                <section
                  className="relative flex w-fit justify-center self-center 
                rounded-2xl border border-vanguard-border p-8"
                >
                  <div className="flex false ">
                    <Skeleton className="w-[350px] h-[350px] max-w-[20rem] rounded-lg" />
                    <Button
                      className={cn(
                        "hidden absolute left-1/2 top-1/2 aspect-square -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full bg-rose-500 p-5 text-white transition hover:brightness-90",
                        { isExpired: "flex" }
                      )}
                    >
                      <ReloadIcon />
                    </Button>
                  </div>
                </section>
                <span className="text-white/80 mt-6 text-center text-sm">
                  Não conseguiu ler o QR Code? Copie o código abaixo e insira-o
                  manualmente:
                </span>
                <div
                  className="rounded-xl bg-transparent px-4 py-2 text-center 
                  flex items-center justify-center text-sm font-semibold outline-none 
                  ring-1 ring-border"
                  style={{ height: "96px" }}
                >
                  <Skeleton className="w-[250px] h-4" />
                </div>
                <Button
                  className="gap mt-4 flex w-full max-w-[20rem] items-center 
                justify-center gap-2 self-center justify-self-center rounded-lg 
                bg-[#17B877] hover:bg-[#17B877] px-6 py-3 text-base 
                font-semibold text-white"
                >
                  Carregando...
                </Button>
              </div>
            </div>

            <div className="flex flex-col-reverse items-center justify-between gap-4 sm:flex-row">
              <div>
                <div className="flex items-center justify-center gap-8">
                  <section className="flex gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      stroke="none"
                      className="tabler-icon tabler-icon-lock-filled text-muted-foreground h-8 w-8"
                    >
                      <path d="M12 2a5 5 0 0 1 5 5v3a3 3 0 0 1 3 3v6a3 3 0 0 1 -3 3h-10a3 3 0 0 1 -3 -3v-6a3 3 0 0 1 3 -3v-3a5 5 0 0 1 5 -5m0 12a2 2 0 0 0 -1.995 1.85l-.005 .15a2 2 0 1 0 2 -2m0 -10a3 3 0 0 0 -3 3v3h6v-3a3 3 0 0 0 -3 -3"></path>
                    </svg>
                    <section className="flex flex-col">
                      <span className="text-muted-foreground text-sm font-normal leading-4">
                        Pagamento
                      </span>
                      <span className="text-muted-foreground text-sm font-semibold leading-4">
                        Seguro
                      </span>
                    </section>
                  </section>
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
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main
      className="flex h-full min-h-screen flex-col items-center pb-20"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      <div className="flex w-full max-w-[75rem] flex-col px-4 sm:px-0">
        <section className="flex w-full flex-col items-center justify-between py-6 sm:py-8 md:flex-row">
          <div className="flex w-full items-center gap-4">
            <Button
              onClick={() => router.back()}
              className=" flex h-10 w-10 items-center justify-center gap-2 rounded-[10px] border text-sm font-bold bg-transparent hover:bg-transparent"
              style={{ borderColor }}
            >
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
                className="tabler-icon tabler-icon-arrow-back h-5 w-5 "
              >
                <path d="M9 11l-4 4l4 4m-4 -4h11a4 4 0 0 0 0 -8h-1"></path>
              </svg>
            </Button>
            <h1 className=" text-2xl font-bold sm:text-4xl">
              Detalhes do pedido
            </h1>
          </div>
        </section>
        <div
          className="flex w-full flex-col gap-8 rounded-xl border p-6 sm:p-10"
          style={{ borderColor, backgroundColor: secondaryColor }}
        >
          <div className="w-ful flex flex-col gap-8 md:flex-row md:gap-12">
            <div className="flex w-full flex-col justify-start gap-8 sm:gap-12">
              <h1 className=" max-w-[25rem] text-left text-3xl font-bold sm:text-4xl">
                Digitalize o <span className="text-blue-400">QR Code </span>com
                seu smartphone
              </h1>
              <section className="">
                <h3 className="text-muted-foreground">Valor</h3>
                <h1 className="text-4xl font-bold">
                  {formatCurrency(data.amount, { addPrefix: true })}
                </h1>
              </section>

              <Countdown
                initialSeconds={data?.expiration}
                onExpire={handleExpire}
              />

              <div className="flex w-full max-w-[32rem]  flex-col items-start  justify-start">
                <h3 className=" font-bold">Instruções</h3>
                <section className="mt-4 flex w-full gap-2">
                  <div className="flex h-[1.5rem] w-full max-w-[1.5rem] items-center justify-center rounded-lg bg-blue-400 font-semibold text-white">
                    1
                  </div>
                  <h3 className="text-muted-foreground">
                    Abra o app do seu banco preferido e selecione a opção PIX
                  </h3>
                </section>
                <section className="mt-4 flex w-full gap-2">
                  <div className="flex h-[1.5rem] w-full max-w-[1.5rem] items-center justify-center rounded-lg bg-blue-400 font-semibold text-white">
                    2
                  </div>
                  <h3 className="text-muted-foreground">
                    Selecione a opção <b>Pix Copia e Cola</b> com o código do
                    pix copiado e cole o código
                  </h3>
                </section>
                <section className="mt-4 flex w-full gap-2">
                  <div className="flex h-[1.5rem] w-full max-w-[1.5rem] items-center justify-center rounded-lg bg-blue-400 font-semibold text-white">
                    3
                  </div>
                  <h3 className="text-muted-foreground">
                    Por fim, clique em confirmar pagamento
                  </h3>
                </section>
              </div>
            </div>

            <div className="flex w-full flex-col">
              <section
                className="relative flex w-fit justify-center self-center rounded-2xl border border-vanguard-border bg-white p-8"
                style={{ borderColor }}
              >
                <div className="flex false ">
                  {/* QR Code */}
                  <img
                    src={data.paymentUrl}
                    alt=""
                    className="h-full w-full max-w[20rem] bg-white rounded-xl"
                  />
                  <Button
                    className={cn(
                      "hidden  absolute left-1/2 top-1/2 aspect-square -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full bg-rose-500 p-5 text-white transition hover:brightness-90",
                      { isExpired: "flex" }
                    )}
                  >
                    <ReloadIcon />
                  </Button>
                </div>
              </section>
              <span className=" mt-6 text-center text-sm">
                Não conseguiu ler o QR Code? Copie o código abaixo e insira-o
                manualmente:
              </span>
              <textarea
                readOnly
                className=" mt-4 select-none resize-none rounded-xl bg-transparent px-4 py-2 text-center text-sm font-semibold outline-none ring-1 ring-border"
                style={{ height: "96px" }}
              >
                {data.paymentCode}
              </textarea>
              <Button
                onClick={copyPaymentCodeToClipboard}
                className="gap mt-4 flex w-full max-w-[20rem] items-center 
                justify-center gap-2 self-center justify-self-center rounded-lg 
                bg-[#17B877] hover:bg-[#17B877] px-6 py-3 text-base 
                font-semibold text-white"
              >
                <h6 className="text-base">
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    viewBox="0 0 16 16"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M4 4l1-1h5.414L14 6.586V14l-1 1H5l-1-1V4zm9 3l-3-3H5v10h8V7z"
                    ></path>
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M3 1L2 2v10l1 1V2h6.414l-1-1H3z"
                    ></path>
                  </svg>
                </h6>
                Copiar código PIX
              </Button>
            </div>
          </div>

          <div className="flex flex-col-reverse items-center justify-between gap-4 sm:flex-row">
            {/* <img
              alt=""
              width="113"
              height="40"
              data-nimg="1"
              className="h-8 sm:h-10"
              src="/_next/static/media/logo-pix.db1523b4.svg"
            /> */}
            <div>
              <div className="flex items-center justify-center gap-8">
                <section className="flex gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    stroke="none"
                    className="tabler-icon tabler-icon-lock-filled text-muted-foreground h-8 w-8"
                  >
                    <path d="M12 2a5 5 0 0 1 5 5v3a3 3 0 0 1 3 3v6a3 3 0 0 1 -3 3h-10a3 3 0 0 1 -3 -3v-6a3 3 0 0 1 3 -3v-3a5 5 0 0 1 5 -5m0 12a2 2 0 0 0 -1.995 1.85l-.005 .15a2 2 0 1 0 2 -2m0 -10a3 3 0 0 0 -3 3v3h6v-3a3 3 0 0 0 -3 -3"></path>
                  </svg>
                  <section className="flex flex-col">
                    <span className="text-muted-foreground text-sm font-normal leading-4">
                      Pagamento
                    </span>
                    <span className="text-muted-foreground text-sm font-semibold leading-4">
                      Seguro
                    </span>
                  </section>
                </section>
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
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
