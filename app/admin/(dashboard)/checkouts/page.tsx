"use client";

import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useNewCheckout } from "@/features/checkouts/hooks/use-new-checkout";
import { useNewProduct } from "@/features/products/hooks/use-new-product";
import { CircleDollarSign, PlusCircle } from "lucide-react";
import { columns as checkoutColumns } from "./columns";
import { columns as productsColumns } from "./products-columns";
import { useGetCheckouts } from "@/features/checkouts/api/use-get-checkouts";
import { useGetProducts } from "@/features/products/api/use-get-products";

export default function Page() {
  const newProduct = useNewProduct();
  const newCheckout = useNewCheckout();

  const checkoutsQuery = useGetCheckouts();
  const checkouts = checkoutsQuery.data ?? [];

  const productsQuery = useGetProducts();
  const products = productsQuery.data ?? [];

  const isDisabled = checkoutsQuery.isLoading || productsQuery.isLoading;

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex flex-col md:flex-row items-center justify-between space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
          Produtos/Checkouts
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
      <Tabs defaultValue="checkouts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="checkouts">Checkouts</TabsTrigger>
          <TabsTrigger value="products">Produtos</TabsTrigger>
        </TabsList>
        <TabsContent value="checkouts" className="space-y-4">
          <Card className="border-none drop-shadow-sm">
            <CardContent>
              <DataTable
                onDelete={(rows) => {
                  const ids = rows.map((row) => row.original.id);
                  console.log(ids);
                }}
                filterKey="slug"
                columns={checkoutColumns}
                data={checkouts}
                disabled={isDisabled}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="products" className="space-y-4">
          <DataTable
            onDelete={(rows) => {
              const ids = rows.map((row) => row.original.id);
              console.log(ids);
            }}
            filterKey="name"
            columns={productsColumns}
            data={products}
            disabled={isDisabled}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
