class CreateMatches < ActiveRecord::Migration
  def change
    create_table :matches do |t|

      t.integer :user_1_id
      t.boolean :user_1_like

      t.integer :user_2_id
      t.boolean :user_2_like

      t.timestamps
    end

    add_index :matches, [:user_1_id, :user_2_id]
  end
end
