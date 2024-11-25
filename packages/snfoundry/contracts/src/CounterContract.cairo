use starknet::ContractAddress;

#[starknet::interface]
pub trait ICounter<T> {
    fn get_counter(self: @T) -> u32;
    fn get_last_increase_by(self: @T) -> ContractAddress;
    fn get_last_premium(self: @T) -> u256;
    fn increase_counter_with_premium(ref self: T, amount_eth: u256);
}

#[starknet::contract]
pub mod CounterContract {
    use OwnableComponent::InternalTrait;
    use contracts::KillSwitch::{IKillSwitchDispatcher, IKillSwitchDispatcherTrait};
    use openzeppelin_access::ownable::OwnableComponent;
    use openzeppelin_token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};
    use starknet::event::EventEmitter;
    use starknet::storage::{StoragePointerWriteAccess, StoragePointerReadAccess};
    use starknet::{ContractAddress, contract_address_const};
    use starknet::{get_caller_address, get_contract_address};
    use super::ICounter;


    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);

    #[abi(embed_v0)]
    impl OwnableImpl = OwnableComponent::OwnableImpl<ContractState>;
    impl OwnableInternalImpl = OwnableComponent::InternalImpl<ContractState>;

    #[storage]
    struct Storage {
        counter: u32,
        last_premium: u256,
        last_increase_by: ContractAddress,
        kill_switch: ContractAddress,
        #[substorage(v0)]
        ownable: OwnableComponent::Storage
    }

    const ETH_CONTRACT_ADDRESS: felt252 =
        0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7;

    #[constructor]
    fn constructor(
        ref self: ContractState,
        initial_value: u32,
        kill_switch: ContractAddress,
        initial_owner: ContractAddress
    ) {
        self.counter.write(initial_value);
        self.kill_switch.write(kill_switch);
        self.ownable.initializer(initial_owner);
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    pub enum Event {
        CounterIncreased: CounterIncreased,
        OwnableEvent: OwnableComponent::Event
    }

    #[derive(Drop, starknet::Event)]
    pub struct CounterIncreased {
        pub value: u32,
        pub premium: u256,
        pub caller: ContractAddress,
    }

    #[abi(embed_v0)]
    impl CounterImpl of ICounter<ContractState> {
        fn get_counter(self: @ContractState) -> u32 {
            self.counter.read()
        }
        fn increase_counter_with_premium(ref self: ContractState, amount_eth: u256) {
            let dispatcher = IKillSwitchDispatcher { contract_address: self.kill_switch.read() };
            assert!(!dispatcher.is_active(), "Kill Switch is active");
            if amount_eth > 0 {
                let eth_contract_address = contract_address_const::<ETH_CONTRACT_ADDRESS>();
                let dispatcher = IERC20Dispatcher { contract_address: eth_contract_address };
                dispatcher.transfer_from(get_caller_address(), get_contract_address(), amount_eth);
            }
            self.counter.write(self.get_counter() + 1);
            self.last_premium.write(amount_eth);
            self.last_increase_by.write(get_caller_address());
            self
                .emit(
                    CounterIncreased {
                        value: self.get_counter(), premium: amount_eth, caller: get_caller_address()
                    }
                );
        }
        fn get_last_increase_by(self: @ContractState) -> ContractAddress {
            self.last_increase_by.read()
        }
        fn get_last_premium(self: @ContractState) -> u256 {
            self.last_premium.read()
        }
    }
}
