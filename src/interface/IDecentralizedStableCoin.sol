interface IDecentralizedStableCoin {
    function burn(uint256 _amount) external;

    function mint(address _to, uint256 _amount) external returns (bool);

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);
}
