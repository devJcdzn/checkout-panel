"use client";

import { BarMultiple } from "@/components/bar-multiple";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNewCheckout } from "@/features/checkouts/hooks/use-new-checkout";
import { useNewProduct } from "@/features/products/hooks/use-new-product";
import { useGetSummary } from "@/features/summary/api/use-get-summary";
import { format } from "date-fns";
import { CircleDollarSign, PlusCircle, TrendingUp } from "lucide-react";

export default function Home() {
  const newProduct = useNewProduct();
  const newCheckout = useNewCheckout();
  const { data, isLoading } = useGetSummary();

  return (
    <>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Dashboard
          </h2>
          <div
            className="flex flex-col gap-3 md:gap-0 md:flex-row w-full md:w-auto 
          items-center space-x-2"
          >
            <Button
              variant={"outline"}
              className="w-full md:w-auto"
              onClick={newProduct.onOpen}
            >
              <PlusCircle />
              Criar Produto
            </Button>
            <Button className="w-full md:w-auto" onClick={newCheckout.onOpen}>
              <CircleDollarSign />
              Criar Checkout
            </Button>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Produtos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading || !data ? (
                  <span className="text-xs text-muted-foreground">
                    Carregando...
                  </span>
                ) : (
                  data?.totalProducts
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Visitas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? (
                  <span className="text-xs text-muted-foreground">
                    Carregando...
                  </span>
                ) : (
                  data.totalImpressions
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversões</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? (
                  <span className="text-xs text-muted-foreground">
                    Carregando...
                  </span>
                ) : (
                  data.totalConversions
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium truncate">
                Modelo mais conversível
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">
                {isLoading ? (
                  <span className="text-xs text-muted-foreground">
                    Carregando...
                  </span>
                ) : (
                  data.topCheckout?.model
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Visão Geral</CardTitle>
            </CardHeader>
            {isLoading ? (
              <span className="text-xs text-muted-foreground pl-2">
                Carregando...
              </span>
            ) : (
              <>
                <CardContent className="pl-2">
                  <BarMultiple data={data?.recentMetricsOfWeek} />
                </CardContent>
                <CardFooter className="flex-col items-start gap-2 text-sm">
                  <div className="flex gap-2 font-medium leading-none">
                    Relação impressções converões diárias
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <div className="leading-none text-muted-foreground">
                    Todas as impressões e coversões contabilizadas.
                  </div>
                </CardFooter>
              </>
            )}
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Recém Acessados</CardTitle>
              <CardDescription>Produtos recém acessados.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {!isLoading &&
                  data.recentCheckouts.map((checkout: any) => (
                    <div className="flex items-center" key={checkout.id}>
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {checkout.slug}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Conversões: {checkout.conversions}
                        </p>
                      </div>
                      <div className="ml-auto font-medium capitalize">
                        <p className="text-sm font-medium leading-none">
                          {checkout?.model}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Último Acesso:{" "}
                          {format(
                            new Date(checkout.updatedAt),
                            "dd/MM/yyyy HH:mm"
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
