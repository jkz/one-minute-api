class CreateMatches < ActiveRecord::Migration
  def change
    create_table :matches do |t|

      t.string :user_1_id
      t.boolean :user_1_like

      t.string :user_2_id
      t.boolean :user_2_like

      t.timestamps
    end

    add_index :matches, [:user_1_id, :user_2_id]
  end
end
