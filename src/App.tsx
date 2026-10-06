import { Route, Routes } from "react-router-dom";
import { ProductListPage } from "./pages/productListPage";
import { CartPage } from "./pages/cartPage";
import { ProductDetailPage } from "./pages/productDetailPage";
import { Layout } from "./components/layout";
function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<ProductListPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
      </Route>
    </Routes>
  );
}

export default App;
