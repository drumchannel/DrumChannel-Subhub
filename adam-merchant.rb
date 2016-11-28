merchant_account_params = {
    :individual => {
        :first_name => "Adam",
        :last_name => "Kuns",
        :email => "adamk@drumchannel.com",
        :phone => "8054073265",
        :date_of_birth => "1989-08-24",
        :ssn => "607-48-8374",
        :address => {
            :street_address => "386 Jalisco Ct",
            :locality => "Camarillo",
            :region => "CA",
            :postal_code => "93010"
            }
        },
    :funding => {
        :descriptor => "Adam Kuns Drums",
        :destination => Braintree::MerchantAccount::FundingDestination::Bank,
        :email => "akunsdrums@gmail.com",
        :mobile_phone => "8054073265",
        :account_number => "5333202199",
        :routing_number => "071101307"
        },
    :tos_accepted => true,
    :master_merchant_account_id => "14ladders_marketplace",
    :id => "blue_ladders_store"
    }
result = Braintree::MerchantAccount.create(merchant_account_params)
