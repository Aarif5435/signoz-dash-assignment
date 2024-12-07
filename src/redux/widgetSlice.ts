import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

import {
  FetchNews,
  FetchStock,
  FetchWeather,
} from "../components/widgets/widget.api";
import {
  Articles,
  NewsDataType,
  StockData,
  WeatherData,
} from "../components/widgets/widget.modal";

export type DashboardState = {
  dashboard: Dashboard[];
  filterDashboard: Dashboard[];
  error: string | null;
  loading: boolean;
  weatherLoading: boolean;
  stockLoading: boolean;
  articles: Articles[];
  weather: WeatherData;
  stocks: StockData;
  currentDashId?: string;
};

export type Dashboard = {
  id: string;
  title: string;
  widgets: Widget[];
  createdAt?: string;
  updatedAt?: string;
};

export type Widget = {
  id: string;
  type: string;
  props: widgetProps;
  size: {
    width: number;
    height: number;
  };
  position: {
    x: number;
    y: number;
  }
};

export type widgetProps = {
  location?: string;
  category?: string;
};

const initialState: DashboardState = {
  dashboard: [],
  filterDashboard: [],
  loading: false,
  weatherLoading: false,
  stockLoading: false,
  error: null,
  articles: [],
  weather: {} as WeatherData,
  stocks: {} as StockData,
  currentDashId: "",
};

export const fetchNewsAsync = createAsyncThunk("News/fetchNews", async () => {
  try {
    const res = await FetchNews();
    const data: NewsDataType = await res.json();
    return data;
  } catch (err) {
    throw new Error("something went wrong " + err);
  }
});

export const fetchWeatherAsync = createAsyncThunk(
  "Weather/fetchWeather",
  async ({ city = "delhi" }: { city: string }) => {
    try {
      const res = await FetchWeather(city);
      const data: WeatherData = await res.json();
      return data;
    } catch (err) {
      throw new Error("something went wrong " + err);
    }
  }
);

export const fetchStockAsync = createAsyncThunk(
  "stocks/fetchStocks",
  async ({ symbol = "APPL" }: { symbol: string }) => {
    try {
      const res = await FetchStock(symbol);
      const data: StockData = await res.json();
      return data;
    } catch (err) {
      throw new Error("something went wrong");
    }
  }
);

const widgetSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    addDashboard: (state, action) => {
      const { title, id } = action.payload;
      const newDashboard: Dashboard = {
        id,
        title,
        widgets: [],
        createdAt: new Date().toLocaleDateString(),
        updatedAt: new Date().toLocaleDateString(),
      };
      state.dashboard.push(newDashboard);
      state.filterDashboard = [...state.dashboard]; // Sync filterDashboard
    },
    editDashboard: (state, action) => {
      const { id, title, widgets } = action.payload;
      const dashboard = state.dashboard.find((dash) => dash.id === id);
      if (dashboard) {
        dashboard.title = title ? title : dashboard.title;
        dashboard.widgets = widgets ? widgets : dashboard.widgets;
        dashboard.updatedAt = new Date().toISOString();
      }
      state.filterDashboard = [...state.dashboard]; 
    },
    removeDashboard: (state, action) => {
      state.dashboard = state.dashboard.filter(
        (dash) => dash.id !== action.payload
      );
      state.filterDashboard = [...state.dashboard]; 
    },
    searchDashboard: (state, action) => {
      const searchQuery = action.payload.toLowerCase();
      if (!searchQuery) {
        state.filterDashboard = [...state.dashboard]; // Reset to all dashboards
      } else {
        state.filterDashboard = state.dashboard.filter((dash) =>
          dash.title.toLowerCase().includes(searchQuery)
        );
      }
    },
    addWidget: (state, action) => {
      const { dashboardId, widget } = action.payload;
      const dashboard = state.dashboard.find((dash) => dash.id === dashboardId);
      if (dashboard) {
        dashboard.widgets.push(widget);
        dashboard.updatedAt = new Date().toLocaleDateString();
      }
      state.filterDashboard = [...state.dashboard]; 
    },
    removeWidget: (state, action) => {
      const { dashboardId, widgetId } = action.payload;
      const dashboard = state.dashboard.find((dash) => dash.id === dashboardId);
      if (dashboard) {
        dashboard.widgets = dashboard.widgets.filter(
          (dash) => dash.id !== widgetId
        );
        dashboard.updatedAt = new Date().toLocaleDateString();
      }
      state.filterDashboard = [...state.dashboard]; // Sync filterDashboard
    },
    updateWidget: (state, action) => {
      const { dashboardId, widgetId, updates } = action.payload;
      const dashboard = state.dashboard.find((dash) => dash.id === dashboardId);
      if (dashboard) {
        const widget = dashboard.widgets.find((wid) => wid.id === widgetId);
        if (widget) {
          Object.assign(widget, updates);
          dashboard.updatedAt = new Date().toLocaleDateString();
        }
      }
      state.filterDashboard = [...state.dashboard]; // Sync filterDashboard
    },
    updateWidgetPosition: (
      state,
      action: PayloadAction<{ id: string; position: { x: number; y: number } }>
    ) => {
      state.dashboard.forEach((dashboard) =>
        dashboard.widgets.forEach((widget) => {
          if (widget.id === action.payload.id) {
            widget.position = action.payload.position;
          }
        })
      );
    },
    updateWidgetSize: (
      state,
      action: PayloadAction<{
        id: string;
        size: { width: number; height: number };
        position: { x: number; y: number };
      }>
    ) => {
      state.dashboard.forEach((dashboard) =>
        dashboard.widgets.forEach((widget) => {
          if (widget.id === action.payload.id) {
            widget.size = action.payload.size;
            widget.position = action.payload.position;
          }
        })
      )
    },
    reorderWidgets: (state, action) => {
      const { dashboardId, reorderedWidgets } = action.payload;
      const dashboard = state.dashboard.find((dash) => dash.id === dashboardId);
      if (dashboard) {
        dashboard.widgets = reorderedWidgets;
        dashboard.updatedAt = new Date().toLocaleDateString();
      }
      state.filterDashboard = [...state.dashboard]; // Sync filterDashboard
    },
    sortByAZ: (state) => {
      state.dashboard.sort((a, b) => a.title.localeCompare(b.title));
      state.filterDashboard = [...state.dashboard]; // Sync filterDashboard
    },
    sortByZA: (state) => {
      state.dashboard.sort((a, b) => b.title.localeCompare(a.title));
      state.filterDashboard = [...state.dashboard]; // Sync filterDashboard
    },
    setCurrentDashId: (state, action) => {
      state.currentDashId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNewsAsync.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(fetchNewsAsync.fulfilled, (state, action) => {
        state.loading = false;
        const { articles } = action.payload;
        state.articles = articles;
      })
      .addCase(fetchNewsAsync.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(fetchWeatherAsync.pending, (state, action) => {
        state.weatherLoading = true;
      })
      .addCase(fetchWeatherAsync.fulfilled, (state, action) => {
        state.weatherLoading = false;
        state.weather = action.payload;
      })
      .addCase(fetchWeatherAsync.rejected, (state, action) => {
        state.weatherLoading = false;
      })
      .addCase(fetchStockAsync.pending, (state, action) => {
        state.stockLoading = true;
      })
      .addCase(fetchStockAsync.fulfilled, (state, action) => {
        state.stockLoading = false;
        state.stocks = action.payload;
      })
      .addCase(fetchStockAsync.rejected, (state, action) => {
        state.stockLoading = false;
      });
  },
});

export const {
  addWidget,
  removeWidget,
  updateWidget,
  reorderWidgets,
  searchDashboard,
  addDashboard,
  editDashboard,
  removeDashboard,
  setCurrentDashId,
  updateWidgetPosition,
  updateWidgetSize,
  sortByAZ,
  sortByZA,
} = widgetSlice.actions;
export default widgetSlice.reducer;
