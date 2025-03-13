package handlers

import (
	"github.com/0xBirdFeeder/self-market/backend/db"
)

type OrderService struct {
	db *db.OrderDB
}

func NewOrderService(db *db.OrderDB) *OrderService {
	return &OrderService{db}
}
