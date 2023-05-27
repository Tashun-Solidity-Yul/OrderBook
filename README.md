# Order Book Simulator

This is a Scaffold-ETH template based project used only for the hardhat functionalities.

Functionality includes a central authority (single address) to have the authority to execute a buy and sell order after verifying their signatures.

Orders only with the same unit prices are executed, if a higher price order is made, it won't be executed to the market value.

To test the functionalities
```agsl
yarn test
```

Buildspace

## License

Project is [MIT licensed](./LICENSE).
