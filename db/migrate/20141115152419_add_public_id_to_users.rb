class AddPublicIdToUsers < ActiveRecord::Migration
  def change
    add_column :users, :public_id, :string
    add_index :users, :public_id, unique: true
  end
end
