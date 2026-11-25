import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, getProductIdParams } from "../_lib/api";
import { Star } from "lucide-react";
import DeleteProductButton from "../_components/DeleteProductButton";

type PageProps = {
  params: Promise<{ id: string }>;
};

export const generateStaticParams = getProductIdParams;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return { title: "Product not found" };
  return { title: product.title, description: product.description };
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  const originalPrice = product.price / (1 - product.discountPercentage / 100);

  const details: [string, string][] = [
    ["Brand", product.brand ?? "—"],
    ["Category", product.category],
    ["SKU", product.sku],
    ["Stock", `${product.stock} (${product.availabilityStatus})`],
    ["Minimum order", String(product.minimumOrderQuantity)],
    ["Weight", `${product.weight} g`],
    [
      "Dimensions",
      `${product.dimensions.width} × ${product.dimensions.height} × ${product.dimensions.depth} cm`,
    ],
    ["Warranty", product.warrantyInformation],
    ["Shipping", product.shippingInformation],
    ["Return policy", product.returnPolicy],
  ];

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/products" className="text-blue-700 hover:underline">
          ← Back to products
        </Link>
        <div className="flex gap-3">
          <Link
            href={`/products/${product.id}/edit`}
            className="rounded-lg border border-blue-600 px-4 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-50"
          >
            Edit product
          </Link>
          <DeleteProductButton
            productId={product.id}
            productTitle={product.title}
          />
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2 mt-6">
        {/* Images */}
        <div>
          <div className="relative h-80 border rounded-lg">
            <Image
              src={product.images[0] ?? product.thumbnail}
              alt={product.title}
              fill
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-contain p-4"
            />
          </div>
          {product.images.length > 1 && (
            <ul className="grid grid-cols-4 gap-2 mt-2">
              {product.images.slice(1).map((src) => (
                <li key={src} className="relative h-20 border rounded">
                  <Image
                    src={src}
                    alt={product.title}
                    fill
                    sizes="120px"
                    className="object-contain p-1"
                  />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Details */}
        <div>
          <p className="text-sm text-gray-500 capitalize">{product.category}</p>
          <h1 className="text-3xl font-bold">{product.title}</h1>
          <p className="mt-2">⭐ {product.rating}</p>

          <div className="flex items-baseline gap-3 mt-4">
            <span className="text-2xl font-bold">${product.price}</span>
            {product.discountPercentage > 0 && (
              <>
                <span className="text-gray-500 line-through">
                  ${originalPrice.toFixed(2)}
                </span>
                <span className="text-sm text-green-600">
                  -{product.discountPercentage}%
                </span>
              </>
            )}
          </div>

          <p className="mt-4">{product.description}</p>

          {product.tags.length > 0 && (
            <ul className="flex flex-wrap gap-2 mt-4">
              {product.tags.map((tag) => (
                <li
                  key={tag}
                  className="text-xs bg-gray-100 text-gray-700 rounded px-2 py-1"
                >
                  #{tag}
                </li>
              ))}
            </ul>
          )}

          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 mt-6 text-sm">
            {details.map(([label, value]) => (
              <div key={label} className="contents">
                <dt className="text-gray-500">{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Reviews */}
      {product.reviews.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-bold mb-4">
            Reviews ({product.reviews.length})
          </h2>
          <ul className="space-y-4">
            {product.reviews.map((review, i) => (
              <li key={i} className="border rounded-lg p-4">
                <div className="flex justify-between">
                  <span className="font-semibold">{review.reviewerName}</span>
                  <span
                    className="flex items-center gap-0.5"
                    aria-label={`${review.rating} out of 5`}
                  >
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </span>
                </div>
                <p className="mt-1">{review.comment}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(review.date).toLocaleDateString("en-US")}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
