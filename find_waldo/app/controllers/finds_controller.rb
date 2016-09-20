class FindsController < ApplicationController

  def index
    @tags = Tag.all

    respond_to do |format|
      format.html
      format.js { render json: @tags.to_json(:include => :character) }
    end
  end

  def create
    @tag = Tag.new(tag_params)
    if @tag.save
      render json: @tag.to_json(:include => :character)
    else

    end
  end

  def destroy
  end

  private

    def tag_params
      params.require(:find).permit(:character_id, :x, :y)
    end

end
