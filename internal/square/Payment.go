package square

type Payment struct {
	// Note: incomplete
	ID         string `json:"id"`
	OrderID    string `json:"order_id"`
	CustomerID string `json:"customer_id"`
	Status     string `json:"status"`
	Version    int    `json:"version"`
}
