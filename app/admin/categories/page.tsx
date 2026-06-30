import { getCategories } from "@/lib/queries";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { CategoryActions } from "./category-actions";

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Categories</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add Category */}
        <Card>
          <CardHeader>
            <h2 className="font-bold">Add New Category</h2>
          </CardHeader>
          <CardContent>
            <CategoryActions mode="create" />
          </CardContent>
        </Card>

        {/* Existing Categories */}
        <Card>
          <CardHeader>
            <h2 className="font-bold">
              Existing Categories ({categories.length})
            </h2>
          </CardHeader>
          <CardContent>
            {categories.length === 0 ? (
              <p className="text-sm text-(--color-muted)">
                No categories yet.
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {categories.map((cat) => (
                  <CategoryActions
                    key={cat.id}
                    mode="edit"
                    category={cat}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
