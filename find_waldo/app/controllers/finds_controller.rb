class FindsController < ApplicationController

  def index
    @tags = Tag.all
    @names = Character.all

    respond_to do |format|
      format.html
      format.json { render json: @names }
    end

  end

  def create
    @tag = Tag.new(tag_params)
    if @tag.save
      render json: @tag
    else

    end
  end

  private

    def tag_params
      params.require(:find).permit(:character_id, :x, :y)
    end

end
