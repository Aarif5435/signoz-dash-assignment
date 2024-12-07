import React, { useEffect, useState } from "react";
import { FaRegCalendarCheck } from "react-icons/fa";
import { MdChevronLeft, MdDelete } from "react-icons/md";
import { MdChevronRight } from "react-icons/md";
import { fetchNewsAsync, removeWidget } from "../../redux/widgetSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { useParams } from "react-router-dom";

export const NewsWidget = (props) => {
  const {widget} = props.props
  const [artNo, setArtNo] = useState(0);
  const dispatch = useDispatch<AppDispatch>();
  const { articles, loading } = useSelector(
    (state: RootState) => state.dashboard
  );
  const { id } = useParams();
  useEffect(() => {
    dispatch(fetchNewsAsync());
  }, [dispatch]);

  const formattedDate = new Date(
    articles[artNo]?.publishedAt
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });


  return (
    <>
      <div className="h-full p-2">
        <div className="flex  gap-4 text-white">
          <img
            className="w-14 h-14 mt-2 rounded-full object-cover"
            src={articles[artNo]?.urlToImage}
            alt="news"
          />
          <span className="w-full">
            <h1 className="font-bold text-2xl w-full flex justify-between">
              {articles[artNo]?.title}
              <button
                onClick={() =>
                  dispatch(
                    removeWidget({ dashboardId: id, widgetId: props.props.id })
                  )
                }
                className="flex top-2 right-0 cursor-pointer ml-2 text-red-500"
              >
                <MdDelete size={30} />
              </button>
            </h1>
            <span className="text-sm text-[#9299A5]">
              {articles[artNo]?.source.name + " - " + articles[artNo]?.author}
            </span>
          </span>
        </div>
        <div className="p-9">
          <p className="text-base text-[#9299A5]">
            {articles[artNo]?.description}
          </p>
        </div>

        <div className="flex justify-between px-4 text-[#9299A5]">
          <span className="flex gap-4 items-center">
            <FaRegCalendarCheck className="text-[#9299A5]" />
            {formattedDate}
          </span>
          <span className="flex items-center cursor-pointer">
            <MdChevronLeft
              onClick={() => artNo > 0 && setArtNo((pre) => pre - 1)}
              size={20}
            />
            {artNo + 1 + " / " + articles.length}
            <MdChevronRight
              onClick={() =>
                artNo < articles.length - 1 && setArtNo((pre) => pre + 1)
              }
              size={20}
            />
          </span>
          <button
            onClick={() => {}}
            className="bg-white p-2 text-black text-base rounded"
          >
            <a
              href={articles[artNo]?.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Read More
            </a>
          </button>
        </div>
      </div>
    </>
  );
};
