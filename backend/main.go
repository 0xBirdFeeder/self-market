package main

import (
	"fmt"
	"net/http"
	"os"

	"github.com/0xBirdFeeder/self-market/backend/db"
	"github.com/0xBirdFeeder/self-market/backend/handlers"
	"github.com/0xBirdFeeder/self-market/backend/order"
	"github.com/0xBirdFeeder/self-market/backend/router"
	"github.com/joho/godotenv"
)

func main() {
	godotenv.Load()

	odb := db.InitDB("order")
	pdb := db.InitDB("proof")

	proofDb := db.Proof(pdb)

	orderDb := db.Order(odb)
	orderBook := order.NewOrderListener(odb)

	p := handlers.NewProofService(proofDb)
	o := handlers.NewOrderService(orderDb)

	r := router.New(p, o)

	port := os.Getenv("PORT")

	go orderBook.StartOrderListener()

	fmt.Printf("now listening on port %s\n", port)
	err := http.ListenAndServe(fmt.Sprintf(":%s", port), r)
	if err != nil {
		fmt.Println(err)
	}
}
