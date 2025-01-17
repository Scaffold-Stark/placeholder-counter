#[starknet::interface]
pub trait IKillSwitch<TContractState> {
    fn is_active(self: @TContractState) -> bool;
    fn activate(ref self: TContractState);
}

#[starknet::contract]
pub mod KillSwitch {
    use super::IKillSwitch;

    #[storage]
    struct Storage {
        is_active: bool,
    }

    #[constructor]
    fn constructor(ref self: ContractState, is_active: bool) {
        self.is_active.write(is_active);
    }

    #[abi(embed_v0)]
    impl KillSwitchImpl of IKillSwitch<ContractState> {
        fn is_active(self: @ContractState) -> bool {
            self.is_active.read()
        }

        fn activate(ref self: ContractState) {
            self.is_active.write(true);
        }
    }
}
