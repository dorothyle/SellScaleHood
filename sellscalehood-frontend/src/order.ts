export interface Order {
    stock: string | null;
    purchase_type: string | null;
    share_count: number;
    price: number | null;
    user_id: string | null;
}