defmodule Indexer.Transform.AddressCoinBalancesDaily do
  @moduledoc """
  Extracts `Explorer.Chain.Address.CoinBalanceDaily` params from other schema's params.
  """

  def params_set(%{coin_balances_params: coin_balances_params_set, blocks: blocks}) do
    coin_balances_params =
      coin_balances_params_set
      |> MapSet.to_list()

    coin_balances_daily_params_list =
      Enum.reduce(coin_balances_params, [], fn coin_balances_param, acc ->
        address_hash = Map.get(coin_balances_param, :address_hash)
        block_number = Map.get(coin_balances_param, :block_number)

        block =
          blocks
          |> Enum.find(fn block ->
            block.number == block_number
          end)

        day = DateTime.to_date(block.timestamp)

        [%{address_hash: address_hash, day: day} | acc]
      end)

    coin_balances_daily_params_set =
      coin_balances_daily_params_list
      |> Enum.dedup()
      |> Enum.into(MapSet.new())

    coin_balances_daily_params_set
  end

  def params_set(%{address_coin_balances_params_with_block_timestamp: address_coin_balances_params_with_block_timestamp}) do
    coin_balances_params =
      address_coin_balances_params_with_block_timestamp
      |> MapSet.to_list()

    coin_balances_daily_params_list =
      Enum.reduce(coin_balances_params, [], fn coin_balances_param, acc ->
        address_hash = Map.get(coin_balances_param, :address_hash)
        block_timestamp = Map.get(coin_balances_param, :block_timestamp)

        day = DateTime.to_date(block_timestamp)

        [%{address_hash: address_hash, day: day} | acc]
      end)

    coin_balances_daily_params_set =
      coin_balances_daily_params_list
      |> Enum.dedup()
      |> Enum.into(MapSet.new())

    coin_balances_daily_params_set
  end
end
